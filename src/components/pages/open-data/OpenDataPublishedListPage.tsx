import { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, Download, Eye, Filter, ChevronDown, Globe, CheckCircle, AlertCircle, RefreshCw, XCircle, Send, Upload, X, FileSpreadsheet, Info, Plus, Clock, Database, Trash2, Edit, PlusCircle, PauseCircle, PlayCircle, Edit2, Shield, Menu, Save, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PublishedData {
  id: string;
  fileName: string;
  category: string;
  publisher: string;
  creator: string;
  createdDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  approver: string;
  description: string;
  format: string[];
  keywords: string;
  license: string;
  fileSize?: string;
  dataSource?: string;
  previewHeaders?: string[];
  previewRows?: any[][];
}

const mockPublishedData: PublishedData[] = [
  {
    id: '1',
    fileName: 'Danh sách tổ chức thực hiện trợ giúp pháp lý Q1-2026.xlsx',
    category: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    creator: 'Nguyễn Văn A',
    createdDate: '01/01/2026',
    status: 'approved',
    approver: 'Lãnh đạo Cục CNTT',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm các trung tâm nhà nước và văn phòng hợp đồng.',
    format: ['Excel'],
    keywords: 'văn bản, pháp luật',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '154 KB',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng tổ chức',
    previewHeaders: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ'],
    previewRows: [
      ['Trung tâm Trợ giúp pháp lý nhà nước Tỉnh A', 'Nguyễn Văn Nam', '123 Hùng Vương, Tỉnh A'],
      ['Văn phòng Luật sư hợp đồng TGPL B', 'Trần Thị Thu', '456 Lê Lợi, Tỉnh B'],
      ['Trung tâm Trợ giúp pháp lý nhà nước Tỉnh C', 'Lê Hoàng Long', '789 Nguyễn Huệ, Tỉnh C']
    ]
  },
  {
    id: '2',
    fileName: 'Danh sách người thực hiện trợ giúp pháp lý 2026.xlsx',
    category: 'Danh sách người thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    creator: 'Trần Thị B',
    createdDate: '15/01/2026',
    status: 'approved',
    approver: 'Lãnh đạo Cục CNTT',
    description: 'Dữ liệu danh sách trợ giúp viên pháp luật và luật sư cộng tác viên.',
    format: ['Excel'],
    keywords: 'trợ giúp, pháp lý',
    license: 'Giấy phép ODC-BY',
    fileSize: '168 KB',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng người thực hiện',
    previewHeaders: ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức'],
    previewRows: [
      ['Nguyễn Văn An', '10', 'Trợ giúp viên pháp luật', 'Trung tâm TGPL Nhà nước Tỉnh X', 'Đường Hùng Vương, Tỉnh X', '0243.123.456'],
      ['Trần Thị Bình', '5', 'Luật sư thực hiện TGPL', 'Văn phòng Luật sư Bình Minh', 'Đường Trần Hưng Đạo, Tỉnh Y', '0283.987.654']
    ]
  },
  {
    id: '3',
    fileName: 'Yêu cầu phê duyệt Danh sách Luật sư Việt Nam mới.xlsx',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Bộ Tư pháp',
    creator: 'Lê Văn C',
    createdDate: '01/02/2026',
    status: 'pending',
    approver: 'Chưa phê duyệt',
    description: 'Yêu cầu công bố dữ liệu danh sách Luật sư Việt Nam cập nhật quý 1/2026.',
    format: ['Excel'],
    keywords: 'luật sư, bổ trợ tư pháp',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '512 KB',
    dataSource: 'CSDL Luật sư Việt Nam',
    previewHeaders: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề'],
    previewRows: [
      ['Lê Văn Long', '15/08/1985', 'Nam', 'Việt Nam', 'CC-9988-BTP', 'THE-1234-LS', 'Văn phòng Luật sư Long & Partners', 'Đoàn Luật sư TP. Hà Nội', 'Đang hoạt động'],
      ['Phạm Thị Hoa', '22/04/1990', 'Nữ', 'Việt Nam', 'CC-5544-BTP', 'THE-5678-LS', 'Công ty Luật TNHH Sen Vàng', 'Đoàn Luật sư TP. HCM', 'Đang hoạt động'],
      ['Trần Hoàng Giang', '10/11/1980', 'Nam', 'Việt Nam', 'CC-2211-BTP', 'THE-9900-LS', 'Văn phòng Luật sư Giang Sơn', 'Đoàn Luật sư Đà Nẵng', 'Tạm ngừng hoạt động']
    ]
  },
  {
    id: '4',
    fileName: 'Yêu cầu bổ sung Danh sách tổ chức TGPL Tỉnh B.xlsx',
    category: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    creator: 'Phạm Thị D',
    createdDate: '10/03/2026',
    status: 'pending',
    approver: 'Chưa phê duyệt',
    description: 'Yêu cầu cập nhật danh sách tổ chức trợ giúp pháp lý bổ sung tại Tỉnh B.',
    format: ['Excel'],
    keywords: 'tgpl, tổ chức, bổ sung',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '48 KB',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng tổ chức',
    previewHeaders: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ'],
    previewRows: [
      ['Văn phòng TGPL Tình Thương B', 'Phạm Quốc Bảo', '789 Trần Phú, Tỉnh B'],
      ['Chi nhánh TGPL số 2 Tỉnh B', 'Hoàng Văn Thắng', '101 Hùng Vương, Tỉnh B']
    ]
  },
  {
    id: '5',
    fileName: 'Danh sách Luật sư Việt Nam cũ (Lỗi định dạng).xlsx',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Cục Bổ trợ tư pháp',
    creator: 'Nguyễn Văn A',
    createdDate: '01/01/2025',
    status: 'rejected',
    approver: 'Lãnh đạo Cục Bổ trợ tư pháp',
    description: 'Danh sách luật sư cũ nộp thử bị từ chối do thiếu các cột thông tin bắt buộc.',
    format: ['Excel'],
    keywords: 'luật sư, lỗi',
    license: 'Giấy phép ODC-BY',
    fileSize: '450 KB',
    dataSource: 'CSDL Luật sư Việt Nam',
    previewHeaders: ['Họ và tên', 'Ngày sinh', 'Số Thẻ luật sư'],
    previewRows: [
      ['Nguyễn Văn B', '12/12/1970', 'THE-0001-LS']
    ]
  },
  {
    id: '6',
    fileName: 'API Danh sách Luật sư Việt Nam',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Bộ Tư pháp',
    creator: 'Hệ thống (User)',
    createdDate: '10/05/2026',
    status: 'approved',
    approver: 'Lãnh đạo Cục CNTT',
    description: 'API Danh sách Luật sư Việt Nam cập nhật trực tuyến.',
    format: ['API'],
    keywords: 'luật sư, api',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '-',
    dataSource: 'API: GET - https://api.moj.gov.vn/luatsu',
    previewHeaders: [],
    previewRows: []
  }
];

const APPROVED_CATEGORIES = [
  {
    id: 'open-data-category-a',
    code: 'ODC001',
    name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    expectedHeaders: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ']
  },
  {
    id: 'open-data-category-b',
    code: 'ODC002',
    name: 'Danh sách người thực hiện trợ giúp pháp lý',
    expectedHeaders: ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức']
  },
  {
    id: 'open-data-category-c',
    code: 'ODC003',
    name: 'Danh sách Luật sư Việt Nam',
    expectedHeaders: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề']
  }
];

const WAREHOUSE_DATABASES = [
  { id: 'db_tgpl_org', name: 'CSDL Trợ giúp pháp lý - Bảng tổ chức' },
  { id: 'db_tgpl_user', name: 'CSDL Trợ giúp pháp lý - Bảng người thực hiện' },
  { id: 'db_luatsu', name: 'CSDL Bổ trợ tư pháp - Bảng luật sư' },
  { id: 'db_tochuc_ls', name: 'CSDL Bổ trợ tư pháp - Bảng tổ chức hành nghề luật sư' },
  { id: 'db_hotich_sinh', name: 'CSDL Hộ tịch - Bảng khai sinh' }
];


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
  weeklyDays?: string[];
  monthlyDay?: number;
  quarterlyMonth?: number;
  quarterlyDay?: number;
}

interface CategoryOption {
  id: string;
  name: string;
  description: string;
}

interface CategoryItem {
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
}

const availableCategories: CategoryOption[] = [
  { id: 'cat_a', name: 'Biên tập danh mục A', description: 'Văn bản pháp luật' },
  { id: 'cat_b', name: 'Danh mục B', description: 'Đăng ký kinh doanh' },
  { id: 'cat_c', name: 'Danh mục C', description: 'Công chứng' },
  { id: 'cat_d', name: 'Danh mục D', description: 'TGPL' },
  { id: 'cat_e', name: 'Danh mục E', description: 'Hộ tịch' },
];

const sampleCategoryData: CategoryItem[] = [
  {
    id: 1,
    code: 'ODCAT001',
    name: 'Mục 1',
    description: 'Mô tả mục dữ liệu mở 1',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '15/12/2024',
    updatedBy: 'Nguyễn Văn A'
  },
  {
    id: 2,
    code: 'ODCAT002',
    name: 'Mục 2',
    description: 'Mô tả mục dữ liệu mở 2',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '14/12/2024',
    updatedBy: 'Trần Thị B'
  },
  {
    id: 3,
    code: 'ODCAT003',
    name: 'Mục 3',
    description: 'Mô tả mục dữ liệu mở 3',
    status: 'inactive',
    publishStatus: 'unpublished',
    approvalStatus: 'draft',
    createdDate: '13/12/2024',
    updatedBy: 'Lê Văn C'
  }
];

const mockSchedules: ScheduleItem[] = [
  {
    id: 1,
    datasetCode: 'ODC001',
    datasetName: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    categoryName: 'Biên tập danh mục A',
    frequency: 'daily',
    startTime: '01:00',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng tổ chức',
    status: 'active',
    lastRun: '04/06/2026 01:00',
    nextRun: '05/06/2026 01:00',
    createdBy: 'Nguyễn Văn A',
    createdDate: '15/01/2026'
  },
  {
    id: 2,
    datasetCode: 'ODC002',
    datasetName: 'Danh sách người thực hiện trợ giúp pháp lý',
    categoryName: 'Danh mục B',
    frequency: 'weekly',
    startTime: '02:00',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng người thực hiện',
    status: 'active',
    lastRun: '01/06/2026 02:00',
    nextRun: '08/06/2026 02:00',
    createdBy: 'Trần Thị B',
    createdDate: '20/01/2026',
    weeklyDays: ['Thứ 2', 'Thứ 4']
  }
];

const validateHeaders = (categoryCode: string, headers: string[]) => {
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  
  if (categoryCode === 'ODC001') {
    const required = [
      ['tên tổ chức thực hiện trợ giúp pháp lý', 'tên tổ chức', 'tổ chức thực hiện trợ giúp pháp lý'],
      ['người đại diện', 'người đại diện pháp luật'],
      ['địa chỉ liên hệ', 'địa chỉ', 'địa chỉ trụ sở']
    ];
    const missing: string[] = [];
    required.forEach(options => {
      const found = options.some(opt => normalizedHeaders.includes(opt));
      if (!found) {
        missing.push(options[0]);
      }
    });
    return { isValid: missing.length === 0, missing };
  }
  
  if (categoryCode === 'ODC002') {
    const required = [
      ['họ tên', 'họ và tên'],
      ['số năm hành nghề'],
      ['vai trò'],
      ['tổ chức hành nghề'],
      ['địa chỉ tổ chức', 'địa chỉ'],
      ['số điện thoại tổ chức', 'sđt tổ chức', 'số điện thoại']
    ];
    const missing: string[] = [];
    required.forEach(options => {
      const found = options.some(opt => normalizedHeaders.includes(opt));
      if (!found) {
        missing.push(options[0]);
      }
    });
    return { isValid: missing.length === 0, missing };
  }

  if (categoryCode === 'ODC003') {
    const required = [
      ['họ và tên', 'họ tên'],
      ['ngày sinh'],
      ['giới tính'],
      ['quốc tịch'],
      ['số chứng chỉ hành nghề luật sư', 'số chứng chỉ hành nghề'],
      ['số thẻ luật sư', 'số thẻ'],
      ['nơi làm việc/nơi hành nghề', 'nơi làm việc', 'nơi hành nghề'],
      ['thành viên đoàn luật sư', 'đoàn luật sư'],
      ['tình trạng hành nghề', 'trạng thái hoạt động']
    ];
    const missing: string[] = [];
    required.forEach(options => {
      const found = options.some(opt => normalizedHeaders.includes(opt));
      if (!found) {
        missing.push(options[0]);
      }
    });
    return { isValid: missing.length === 0, missing };
  }

  return { isValid: true, missing: [] };
};

export function OpenDataPublishedListPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'approval' | 'schedule'>('requests');
  const [dataList, setDataList] = useState<PublishedData[]>(mockPublishedData);

  const getDatasetFormat = (datasetId: string) => {
    if (!datasetId) return null;
    const category = APPROVED_CATEGORIES.find(c => c.code === datasetId);
    if (!category) return null;
    const matchedData = dataList.find(item => item.category === category.name && item.status === 'approved');
    if (!matchedData) return null;
    return matchedData.format.includes('API') ? 'API' : 'file';
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [selectedData, setSelectedData] = useState<PublishedData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination states
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Form Request States
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState('Yêu cầu công bố đã được ghi nhận');
  const [requestFileName, setRequestFileName] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestCategory, setRequestCategory] = useState('');
  const [requestKeywords, setRequestKeywords] = useState('');
  const [requestLicense, setRequestLicense] = useState('Giấy phép dữ liệu mở công cộng');
  const [requestPublisher, setRequestPublisher] = useState('Bộ Tư pháp');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [uploadType, setUploadType] = useState<'file' | 'api'>('file');
  const [apiType, setApiType] = useState<'internal' | 'external'>('internal');
  const [selectedInternalApiId, setSelectedInternalApiId] = useState('');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [apiParams, setApiParams] = useState('');
  const [apiHeaders, setApiHeaders] = useState('');
  const [apiBody, setApiBody] = useState('');
  const [apiTitle, setApiTitle] = useState('');
  const [apiDesc, setApiDesc] = useState('');
  const [internalApis, setInternalApis] = useState<any[]>([]);

  useEffect(() => {
    if (showRequestModal) {
      const savedApis = localStorage.getItem('provision_apis');
      if (savedApis) {
        setInternalApis(JSON.parse(savedApis));
      } else {
        setInternalApis([]);
      }
    }
  }, [showRequestModal]);

  // Validation & Parse States
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [validationDetails, setValidationDetails] = useState<{ isValid: boolean; missing: string[] } | null>(null);
  const [uploadedPreviewHeaders, setUploadedPreviewHeaders] = useState<string[]>([]);
  const [uploadedPreviewRows, setUploadedPreviewRows] = useState<any[][]>([]);

  // Approval Tab States
  const [selectedApprovalItem, setSelectedApprovalItem] = useState<PublishedData | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [approveOpinion, setApproveOpinion] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);



  // Schedule Tab States
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    datasetId: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly' | 'quarterly',
    startTime: '08:00',
    startDate: '',
    endDate: '',
    publishFormat: 'api' as 'api' | 'file',
    targetAudience: '',
    contactInfo: '',
    dataSource: '',
    weeklyDays: [] as string[],
    monthlyDay: 1,
    quarterlyDay: 1,
    quarterlyMonth: 1
  });
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  // Schedule Tab Filter States
  const [selectedScheduleFrequency, setSelectedScheduleFrequency] = useState<string>('all');
  const [selectedScheduleStatus, setSelectedScheduleStatus] = useState<string>('all');

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, selectedStatus, selectedCategory, selectedPublisher, selectedScheduleFrequency, selectedScheduleStatus, activeTab]);

  useEffect(() => {
    setCurrentPageNum(1);
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedPublisher('all');
    setSearchTerm('');
    setSelectedScheduleFrequency('all');
    setSelectedScheduleStatus('all');
    setShowFilters(false);
  }, [activeTab]);

  // Filters
  const filteredRequests = dataList.filter(item => {
    if (!item) return false;
    const nameToSearch = (item.fileName || '').toLowerCase();
    const matchSearch = nameToSearch.includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchPublisher = selectedPublisher === 'all' || item.publisher === selectedPublisher;
    return matchSearch && matchStatus && matchCategory && matchPublisher;
  });

  const totalItemsCount = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const filteredApprovalRequests = dataList.filter(item => {
    if (!item) return false;
    if (item.status === 'draft') return false;
    const nameToSearch = (item.fileName || '').toLowerCase();
    const matchSearch = nameToSearch.includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchPublisher = selectedPublisher === 'all' || item.publisher === selectedPublisher;
    return matchSearch && matchStatus && matchCategory && matchPublisher;
  });

  const totalApprovalItemsCount = filteredApprovalRequests.length;
  const paginatedApprovalRequests = filteredApprovalRequests.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);



  const filteredSchedules = schedules.filter(sch => {
    if (!sch) return false;
    const nameToSearch = (sch.datasetName || '').toLowerCase();
    const dbToSearch = (sch.dataSource || '').toLowerCase();
    const matchSearch = nameToSearch.includes(searchTerm.toLowerCase()) || dbToSearch.includes(searchTerm.toLowerCase());
    const matchFrequency = selectedScheduleFrequency === 'all' || sch.frequency === selectedScheduleFrequency;
    const matchStatus = selectedScheduleStatus === 'all' || sch.status === selectedScheduleStatus;
    return matchSearch && matchFrequency && matchStatus;
  });

  const totalScheduleItemsCount = filteredSchedules.length;
  const paginatedSchedules = filteredSchedules.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-50 text-green-600 border-green-200',
      pending: 'bg-purple-50 text-purple-600 border-purple-200',
      rejected: 'bg-red-50 text-red-600 border-red-200',
      draft: 'bg-slate-50 text-slate-600 border-slate-200'
    };
    const labels = {
      approved: 'Đã công bố',
      pending: 'Chờ công bố',
      rejected: 'Từ chối',
      draft: 'Bản nháp'
    };
    return (
      <span className={`inline-block px-2.5 py-1 text-xs border rounded-full font-medium text-center leading-tight whitespace-nowrap ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || 'Chờ công bố'}
      </span>
    );
  };

  const handleViewDetail = (item: PublishedData) => {
    setSelectedData(item);
    setShowDetailModal(true);
  };

  const handleDownload = (fileName: string, format: string = 'Excel') => {
    alert(`Tải xuống tệp dữ liệu: ${fileName}\nĐịnh dạng: ${format}`);
  };

  const runValidation = (file: File, categoryCode: string, isForNewVersion: boolean = false) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(extension);

    setIsValidating(true);
    setValidationError(null);
    setValidationSuccess(false);
    setValidationDetails(null);

    if (!isSpreadsheet) {
      setTimeout(() => {
        setValidationSuccess(true);
        setValidationError(null);
        setUploadedPreviewHeaders([]);
        setUploadedPreviewRows([]);
        setIsValidating(false);
      }, 500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        if (jsonData.length === 0 || !jsonData[0] || jsonData[0].length === 0) {
          setValidationError("Tệp trống hoặc không đọc được dữ liệu dòng đầu tiên.");
          setIsValidating(false);
          return;
        }
        
        const headers = jsonData[0].map(cell => String(cell || '').trim());
        const validation = validateHeaders(categoryCode, headers);
        
        setValidationDetails(validation);
        if (validation.isValid) {
          setValidationSuccess(true);
          setValidationError(null);
          
          setUploadedPreviewHeaders(headers);
          setUploadedPreviewRows(jsonData.slice(1, 6)); 
        } else {
          setValidationSuccess(false);
          setValidationError(`Tệp thiếu các cột bắt buộc: ${validation.missing.join(', ')}`);
        }
      } catch (error) {
        console.error("Lỗi đọc file:", error);
        setValidationError("Đã xảy ra lỗi khi đọc tệp. Vui lòng kiểm tra lại tệp.");
      } finally {
        setIsValidating(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size >= MAX_SIZE) {
      setValidationError("Kích thước tệp quá lớn. Chỉ chấp nhận tệp dưới 100MB.");
      setUploadedFile(null);
      setValidationSuccess(false);
      setValidationDetails(null);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['csv', 'xml', 'xlsx', 'docx', 'doc', 'pdf', 'edxml', 'xls'];
    if (!allowedExtensions.includes(extension)) {
      setValidationError("Định dạng tệp không được hỗ trợ. Chỉ chấp nhận các định dạng: CSV, XML, XLSX, DOCX, DOC, PDF, EDXML.");
      setUploadedFile(null);
      setValidationSuccess(false);
      setValidationDetails(null);
      return;
    }

    setUploadedFile(file);
    if (requestCategory) {
      runValidation(file, requestCategory, false);
    } else {
      setValidationError("Vui lòng chọn Danh mục dữ liệu mở trước khi tải tệp lên để chạy kiểm tra.");
      setValidationSuccess(false);
    }
  };

  const createNewRecord = (status: 'pending' | 'draft'): PublishedData => {
    const currentCategoryObj = APPROVED_CATEGORIES.find(c => c.code === requestCategory);
    let fileName = '';
    let fileSize = '-';
    let dataSource = '';
    let previewHeaders: string[] = [];
    let previewRows: any[][] = [];

    if (uploadType === 'file') {
      fileName = requestFileName || (uploadedFile ? uploadedFile.name : '');
      fileSize = uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : '-';
      dataSource = WAREHOUSE_DATABASES.find(db => db.id === (requestCategory === 'ODC001' ? 'db_tgpl_org' : requestCategory === 'ODC002' ? 'db_tgpl_user' : 'db_luatsu'))?.name || 'Cơ sở dữ liệu kho';
      previewHeaders = uploadedPreviewHeaders;
      previewRows = uploadedPreviewRows;
    } else {
      if (apiType === 'internal') {
        const selectedApi = internalApis.find(api => api.id === selectedInternalApiId);
        fileName = selectedApi ? selectedApi.name : 'API Cung cấp dữ liệu';
        dataSource = selectedApi ? `API: ${selectedApi.method} - ${selectedApi.endpoint}` : 'API cung cấp dữ liệu';
      } else {
        fileName = apiTitle || 'API Cơ quan nhà nước';
        dataSource = `API: ${apiMethod} - ${apiUrl}`;
      }
    }

    return {
      id: Date.now().toString(),
      fileName: fileName,
      category: currentCategoryObj ? currentCategoryObj.name : 'Danh mục dữ liệu mở',
      publisher: requestPublisher || 'Bộ Tư pháp',
      creator: 'Hệ thống (User)',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      status: status,
      approver: 'Chưa phê duyệt',
      description: uploadType === 'file' 
        ? (requestDescription || 'Yêu cầu công bố dữ liệu mở tải lên từ tệp')
        : (apiDesc || requestDescription || 'Yêu cầu công bố dữ liệu mở lấy từ API'),
      format: uploadType === 'file' 
        ? [(uploadedFile?.name.split('.').pop()?.toUpperCase() || 'EXCEL')] 
        : ['API'],
      keywords: requestKeywords || (uploadType === 'file' ? 'dữ liệu mở, file' : 'dữ liệu mở, api'),
      license: requestLicense || 'Giấy phép dữ liệu mở công cộng',
      fileSize: fileSize,
      dataSource: dataSource,
      previewHeaders: previewHeaders,
      previewRows: previewRows
    };
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadType === 'file') {
      if (!validationSuccess || !uploadedFile) {
        alert("Vui lòng tải lên tệp hợp lệ trước khi gửi!");
        return;
      }
    } else {
      if (apiType === 'internal') {
        if (!selectedInternalApiId) {
          alert("Vui lòng chọn API từ danh mục cung cấp dữ liệu!");
          return;
        }
      } else {
        if (!apiUrl || !apiTitle || !apiDesc) {
          alert("Vui lòng điền đầy đủ các thông tin API bắt buộc!");
          return;
        }
      }
    }

    const newRecord = createNewRecord('pending');
    setDataList([newRecord, ...dataList]);
    setShowRequestModal(false);
    setSuccessPopupMessage('Yêu cầu công bố đã được gửi đi phê duyệt');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
    resetRequestForm();
  };

  const handleSaveDraft = () => {
    if (uploadType === 'file') {
      if (!uploadedFile) {
        alert("Vui lòng chọn tệp trước khi lưu nháp!");
        return;
      }
    } else {
      if (apiType === 'internal') {
        if (!selectedInternalApiId) {
          alert("Vui lòng chọn API trước khi lưu nháp!");
          return;
        }
      } else {
        if (!apiUrl || !apiTitle) {
          alert("Vui lòng điền ít nhất URL và Tiêu đề API để lưu nháp!");
          return;
        }
      }
    }

    const newRecord = createNewRecord('draft');
    setDataList([newRecord, ...dataList]);
    setShowRequestModal(false);
    setSuccessPopupMessage('Yêu cầu công bố đã được lưu nháp');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
    resetRequestForm();
  };

  const resetRequestForm = () => {
    setRequestFileName('');
    setRequestDescription('');
    setRequestCategory('');
    setRequestKeywords('');
    setRequestLicense('Giấy phép dữ liệu mở công cộng');
    setRequestPublisher('Bộ Tư pháp');
    setUploadedFile(null);
    setValidationError(null);
    setValidationSuccess(false);
    setValidationDetails(null);
    
    setUploadType('file');
    setApiType('internal');
    setSelectedInternalApiId('');
    setApiMethod('GET');
    setApiUrl('');
    setApiParams('');
    setApiHeaders('');
    setApiBody('');
    setApiTitle('');
    setApiDesc('');
  };

  // Approval actions
  const handleApprove = (item: PublishedData, opinion?: string) => {
    setDataList(dataList.map(d => d.id === item.id ? { 
      ...d, 
      status: 'approved', 
      approver: 'Lãnh đạo Nghiệp vụ', 
      description: opinion ? `${d.description}\n[Ý kiến phê duyệt: ${opinion}]` : d.description 
    } : d));
    setShowApprovalModal(false);
    setShowApproveConfirmModal(false);
    setApproveOpinion('');
    setSuccessPopupMessage('Đã phê duyệt yêu cầu công bố thành công!');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleReject = () => {
    if (!selectedApprovalItem) return;
    if (!rejectReason.trim()) {
      setRejectReasonError(true);
      return;
    }
    setDataList(dataList.map(d => d.id === selectedApprovalItem.id ? { 
      ...d, 
      status: 'rejected', 
      approver: 'Lãnh đạo Nghiệp vụ', 
      description: `${d.description}\n[Từ chối do: ${rejectReason}]` 
    } : d));
    setShowApprovalModal(false);
    setShowRejectConfirmModal(false);
    setRejectReason('');
    setRejectReasonError(false);
    setSuccessPopupMessage('Yêu cầu đã bị từ chối công bố.');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };


  const renderPagination = (total: number) => {
    if (total <= 0) return null;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, total);

    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white text-[13px] text-slate-600">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>bản ghi/trang</span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {startItem} - {endItem} / {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-[13px] transition-colors cursor-pointer ${
                  currentPageNum === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header - Styled matching the mockup */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-6 py-4 text-[14px] transition-all border-b-2 font-medium cursor-pointer ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'requests' ? 'text-blue-600' : 'text-slate-400'}`} />
            Yêu cầu công bố
          </button>
          <button
            onClick={() => {
              setActiveTab('approval');
              setShowRejectForm(false);
              setRejectReason('');
            }}
            className={`flex items-center gap-2 px-6 py-4 text-[14px] transition-all border-b-2 font-medium cursor-pointer ${
              activeTab === 'approval'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${activeTab === 'approval' ? 'text-blue-600' : 'text-slate-400'}`} />
            Phê duyệt
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-6 py-4 text-[14px] transition-all border-b-2 font-medium cursor-pointer ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'schedule' ? 'text-blue-600' : 'text-slate-400'}`} />
            Lịch công bố
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-6">
        
        {/* RENDER TAB 1: YÊU CẦU CÔNG BỐ */}
        {activeTab === 'requests' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter and Search Row */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 w-full flex items-center gap-2">
                  <div className="flex-1 relative group">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên tệp dữ liệu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50 font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      showFilters
                        ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                  >
                    {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      resetRequestForm();
                      setShowRequestModal(true);
                    }}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Gửi yêu cầu công bố
                  </button>
                </div>
              </div>

              {/* Advanced Collapsible Filter Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái yêu cầu</label>
                      <div className="relative">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                        >
                          <option value="all">Tất cả trạng thái</option>
                          <option value="draft">Bản nháp</option>
                          <option value="pending">Chờ công bố</option>
                          <option value="approved">Đã công bố</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Danh mục mở</label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                        >
                          <option value="all">Tất cả danh mục</option>
                          <option value="Danh sách tổ chức thực hiện trợ giúp pháp lý">Danh sách tổ chức thực hiện trợ giúp pháp lý</option>
                          <option value="Danh sách người thực hiện trợ giúp pháp lý">Danh sách người thực hiện trợ giúp pháp lý</option>
                          <option value="Danh sách Luật sư Việt Nam">Danh sách Luật sư Việt Nam</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cơ quan công bố</label>
                      <div className="relative">
                        <select
                          value={selectedPublisher}
                          onChange={(e) => setSelectedPublisher(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                        >
                          <option value="all">Tất cả cơ quan</option>
                          <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                          <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Data Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap w-16 text-[14px]">STT</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Tên tệp dữ liệu</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Danh mục</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Cơ quan công bố</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Người tạo</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Ngày tạo</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Người phê duyệt</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[14px] w-32">Trạng thái</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[14px] w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-[14px]">
                          Không tìm thấy yêu cầu công bố nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-all border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                            {(currentPageNum - 1) * pageSize + index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <div 
                              className="font-semibold text-blue-600 flex items-center gap-1.5 cursor-pointer hover:underline" 
                              onClick={() => handleViewDetail(item)}
                            >
                              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                              {item.fileName || 'Không có tên tệp'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-left text-slate-700 font-medium text-[13px]">{item.category}</td>
                          <td className="px-4 py-3 text-left text-slate-650 text-[13px]">{item.publisher}</td>
                          <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{item.creator}</td>
                          <td className="px-4 py-3 text-left text-slate-600 text-[13px]">{item.createdDate}</td>
                          <td className="px-4 py-3 text-left text-slate-600 text-[13px]">{item.approver}</td>
                          <td className="px-4 py-3 text-center text-[13px]">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleViewDetail(item)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalItemsCount)}
            </div>
          </div>
        )}

        {/* RENDER TAB 2: PHÊ DUYỆT */}
        {activeTab === 'approval' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter and Search Row */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 w-full flex items-center gap-2">
                  <div className="flex-1 relative group">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên tệp dữ liệu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50 font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      showFilters
                        ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                  >
                    {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                </div>
              </div>

              {/* Advanced Collapsible Filter Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái yêu cầu</label>
                      <div className="relative">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                        >
                          <option value="all">Tất cả trạng thái</option>
                          <option value="pending">Chờ công bố</option>
                          <option value="approved">Đã công bố</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Danh mục mở</label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                        >
                          <option value="all">Tất cả danh mục</option>
                          <option value="Danh sách tổ chức thực hiện trợ giúp pháp lý">Danh sách tổ chức thực hiện trợ giúp pháp lý</option>
                          <option value="Danh sách người thực hiện trợ giúp pháp lý">Danh sách người thực hiện trợ giúp pháp lý</option>
                          <option value="Danh sách Luật sư Việt Nam">Danh sách Luật sư Việt Nam</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cơ quan công bố</label>
                      <div className="relative">
                        <select
                          value={selectedPublisher}
                          onChange={(e) => setSelectedPublisher(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                        >
                          <option value="all">Tất cả cơ quan</option>
                          <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                          <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Data Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap w-16 text-[14px]">STT</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Tên tập dữ liệu</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Danh mục</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Cơ quan công bố</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Người tạo</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Ngày tạo</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[14px] w-32">Trạng thái</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[14px] w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedApprovalRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500 text-[14px]">
                          Không có yêu cầu công bố nào được tìm thấy.
                        </td>
                      </tr>
                    ) : (
                      paginatedApprovalRequests.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-all border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <div className="flex items-center gap-1.5">
                              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span 
                                className="font-semibold text-blue-600 hover:underline cursor-pointer"
                                onClick={() => {
                                  setSelectedApprovalItem(item);
                                  setRejectReason('');
                                  setShowRejectForm(false);
                                  setShowApprovalModal(true);
                                }}
                              >
                                {item.fileName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium text-[13px]">{item.category}</td>
                          <td className="px-4 py-3 text-slate-500 text-[13px]">{item.publisher}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium text-[13px]">{item.creator}</td>
                          <td className="px-4 py-3 text-slate-550 text-[13px]">{item.createdDate}</td>
                          <td className="px-4 py-3 text-center text-[13px]">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApprovalItem(item);
                                setRejectReason('');
                                setShowRejectForm(false);
                                setShowApprovalModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center cursor-pointer transition-colors"
                              title="Xem chi tiết & Phê duyệt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalApprovalItemsCount)}
            </div>
          </div>
        )}



        {/* RENDER TAB 4: LỊCH CÔNG BỐ */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter and Search Row */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Search input with clear button inside */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tập dữ liệu, nguồn dữ liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 h-10"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setScheduleFormData({
                        datasetId: '',
                        frequency: 'daily',
                        startTime: '08:00',
                        startDate: '',
                        endDate: '',
                        publishFormat: 'api',
                        targetAudience: '',
                        contactInfo: '',
                        dataSource: '',
                        weeklyDays: [],
                        monthlyDay: 1,
                        quarterlyDay: 1,
                        quarterlyMonth: 1
                      });
                      setIsEditingSchedule(false);
                      setSelectedSchedule(null);
                      setShowScheduleModal(true);
                    }}
                    className="flex-1 lg:flex-none px-4 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm lịch mới
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tần suất công bố</label>
                  <div className="relative">
                    <select
                      value={selectedScheduleFrequency}
                      onChange={(e) => setSelectedScheduleFrequency(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer text-slate-700 h-10"
                    >
                      <option value="all">Tất cả tần suất</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                      <option value="monthly">Hàng tháng</option>
                      <option value="quarterly">Hàng quý</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Trạng thái lịch</label>
                  <div className="relative">
                    <select
                      value={selectedScheduleStatus}
                      onChange={(e) => setSelectedScheduleStatus(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer text-slate-700 h-10"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedules Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap w-16 text-[14px]">STT</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Tên tập dữ liệu</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px] w-28">Mã</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Tần suất</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Giờ chạy</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Lần chạy cuối</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[14px]">Lần chạy tiếp</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[14px] w-32">Trạng thái</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[14px] w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-[14px]">
                          Không tìm thấy lịch công bố nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedSchedules.map((schedule, index) => (
                        <tr key={schedule.id} className="hover:bg-slate-50 transition-all border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                            {(currentPageNum - 1) * pageSize + index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                              <span 
                                className="font-semibold text-blue-600 hover:underline cursor-pointer"
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsEditingSchedule(true);
                                  setScheduleFormData({
                                    datasetId: schedule.datasetCode,
                                    frequency: schedule.frequency,
                                    startTime: schedule.startTime,
                                    dataSource: schedule.dataSource,
                                    startDate: schedule.startDate || '',
                                    endDate: schedule.endDate || '',
                                    publishFormat: schedule.publishFormat || 'api',
                                    targetAudience: schedule.targetAudience || '',
                                    contactInfo: schedule.contactInfo || '',
                                    weeklyDays: schedule.weeklyDays || [],
                                    monthlyDay: schedule.monthlyDay || 1,
                                    quarterlyDay: schedule.quarterlyDay || 1,
                                    quarterlyMonth: schedule.quarterlyMonth || 1
                                  });
                                  setShowScheduleModal(true);
                                }}
                              >
                                {schedule.datasetName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <code className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-medium text-slate-700">
                              {schedule.datasetCode}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-[13px]">
                            <div className="font-semibold text-slate-800">
                              {schedule.frequency === 'daily' ? 'Hàng ngày' : schedule.frequency === 'weekly' ? 'Hàng tuần' : schedule.frequency === 'monthly' ? 'Hàng tháng' : 'Hàng quý'}
                            </div>
                            {schedule.frequency === 'weekly' && schedule.weeklyDays && schedule.weeklyDays.length > 0 && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {schedule.weeklyDays.join(', ')}
                              </div>
                            )}
                            {schedule.frequency === 'monthly' && schedule.monthlyDay && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Ngày {schedule.monthlyDay} hàng tháng
                              </div>
                            )}
                            {schedule.frequency === 'quarterly' && schedule.quarterlyMonth && schedule.quarterlyDay && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Tháng thứ {schedule.quarterlyMonth}, ngày {schedule.quarterlyDay}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 font-medium">{schedule.startTime}</td>
                          <td className="px-4 py-3.5 text-slate-500">{schedule.lastRun || 'Chưa chạy'}</td>
                          <td className="px-4 py-3.5 text-slate-600 font-semibold">{schedule.nextRun}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${schedule.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              {schedule.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsEditingSchedule(true);
                                  setScheduleFormData({
                                    datasetId: schedule.datasetCode,
                                    frequency: schedule.frequency,
                                    startTime: schedule.startTime,
                                    dataSource: schedule.dataSource,
                                    startDate: schedule.startDate || '',
                                    endDate: schedule.endDate || '',
                                    publishFormat: schedule.publishFormat || 'api',
                                    targetAudience: schedule.targetAudience || '',
                                    contactInfo: schedule.contactInfo || '',
                                    weeklyDays: schedule.weeklyDays || [],
                                    monthlyDay: schedule.monthlyDay || 1,
                                    quarterlyDay: schedule.quarterlyDay || 1,
                                    quarterlyMonth: schedule.quarterlyMonth || 1
                                  });
                                  setShowScheduleModal(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                title="Sửa lịch"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {schedule.status === 'active' ? (
                                <button
                                  onClick={() => {
                                    setSchedules(schedules.map(s => s.id === schedule.id ? { ...s, status: 'inactive' } : s));
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                                  title="Tạm dừng"
                                >
                                  <PauseCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSchedules(schedules.map(s => s.id === schedule.id ? { ...s, status: 'active' } : s));
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                                  title="Tiếp tục"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setShowDeleteScheduleModal(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                title="Xóa lịch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalScheduleItemsCount)}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-slate-900">Chi tiết Yêu cầu công bố dữ liệu mở</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên tệp dữ liệu</label>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    {selectedData.fileName || 'Không có tên tệp'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trạng thái yêu cầu</label>
                  <div>{getStatusBadge(selectedData.status)}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Người phê duyệt</label>
                  <div className="text-sm font-medium text-slate-900">{selectedData.approver}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả</label>
                  <div className="text-sm text-slate-955 whitespace-pre-wrap">{selectedData.description}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Danh mục</label>
                  <div className="text-sm text-slate-900">{selectedData.category}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Đơn vị công bố</label>
                  <div className="text-sm text-slate-900">{selectedData.publisher}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Người tạo yêu cầu</label>
                  <div className="text-sm text-slate-900">{selectedData.creator}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ngày tạo yêu cầu</label>
                  <div className="text-sm text-slate-900">{selectedData.createdDate}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Giấy phép áp dụng</label>
                  <div className="text-sm text-slate-900">{selectedData.license}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Từ khóa</label>
                  <div className="text-sm text-slate-900">{selectedData.keywords || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Gửi yêu cầu công bố dữ liệu</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-6 flex-1 text-[13px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tên tập dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên tập dữ liệu (ví dụ: Danh sách tổ chức TGPL Quý 2/2026)"
                    value={requestFileName}
                    onChange={(e) => setRequestFileName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Danh mục dữ liệu mở <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requestCategory}
                    required
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setRequestCategory(newCat);
                      if (uploadedFile) {
                        if (newCat) {
                          runValidation(uploadedFile, newCat, false);
                        } else {
                          setValidationError('Vui lòng chọn Danh mục dữ liệu mở để kiểm tra cấu trúc metadata của tệp.');
                          setValidationSuccess(false);
                          setValidationDetails(null);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Chọn danh mục dữ liệu mở --</option>
                    {APPROVED_CATEGORIES.map(cat => (
                      <option key={cat.code} value={cat.code}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giấy phép</label>
                  <select
                    value={requestLicense}
                    onChange={(e) => setRequestLicense(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Giấy phép dữ liệu mở công cộng">Giấy phép dữ liệu mở công cộng</option>
                    <option value="Giấy phép ODC-BY">Giấy phép ODC-BY</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Từ khóa</label>
                  <input
                    type="text"
                    placeholder="Ngăn cách bằng dấu phẩy, vd: luat, tgpl, tro giup"
                    value={requestKeywords}
                    onChange={(e) => setRequestKeywords(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cơ quan công bố</label>
                  <input
                    type="text"
                    placeholder="Nhập tên cơ quan"
                    value={requestPublisher}
                    onChange={(e) => setRequestPublisher(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Thông tin mô tả</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả nội dung tập dữ liệu công bố..."
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Upload Type Selector */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-2">
                    Dạng tải dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setUploadType('file'); setValidationError(null); setValidationSuccess(false); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        uploadType === 'file'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Tải lên tệp
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUploadType('api'); setValidationError(null); setValidationSuccess(false); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        uploadType === 'api'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      Lấy từ API
                    </button>
                  </div>
                </div>

                {/* FILE UPLOAD SECTION */}
                {uploadType === 'file' && (
                  <>
                    <div className="col-span-1 md:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Cấu trúc Metadata yêu cầu</h4>
                          {requestCategory ? (
                            <>
                              <p className="text-xs text-slate-600 mb-2">Tệp dữ liệu tải lên bắt buộc phải chứa các cột tiêu đề ở dòng đầu tiên:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {APPROVED_CATEGORIES.find(c => c.code === requestCategory)?.expectedHeaders.map((hdr, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">{hdr}</span>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-slate-500 italic">Vui lòng chọn danh mục dữ liệu mở để xem cấu trúc metadata yêu cầu.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Tải lên tệp dữ liệu <span className="text-red-500">*</span>
                      </label>
                      {!uploadedFile ? (
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); }}
                          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-slate-50/50"
                          onClick={() => document.getElementById('data-file-upload')?.click()}
                        >
                          <input
                            id="data-file-upload"
                            type="file"
                            accept=".xlsx,.xls,.csv,.xml,.docx,.doc,.pdf,.edxml"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-700 mb-1">Kéo thả tệp vào đây hoặc click để chọn tệp</p>
                          <p className="text-xs text-slate-500">Hỗ trợ: .xlsx, .xls, .csv, .xml, .docx, .doc, .pdf, .edxml — Tối đa 100MB</p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileSpreadsheet className="w-6 h-6" /></div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900 truncate max-w-md">{uploadedFile.name}</div>
                              <div className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                            </div>
                          </div>
                          <button type="button" onClick={() => { setUploadedFile(null); setValidationError(null); setValidationSuccess(false); setValidationDetails(null); }} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {(isValidating || validationError || validationSuccess) && (
                      <div className="col-span-1 md:col-span-2">
                        {isValidating && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                            Đang đọc và đối chiếu metadata file...
                          </div>
                        )}
                        {!isValidating && validationError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                            <div><span className="font-semibold">Lỗi cấu trúc metadata: </span>{validationError}</div>
                          </div>
                        )}
                        {!isValidating && validationSuccess && (
                          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            <div><span className="font-semibold">Kiểm tra hợp lệ: </span>Tệp dữ liệu khớp với cấu trúc metadata của danh mục đã chọn!</div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* API SECTION */}
                {uploadType === 'api' && (
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2">Loại API</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setApiType('internal')}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                            apiType === 'internal' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          API Nội bộ (từ mục Cung cấp dữ liệu)
                        </button>
                        <button
                          type="button"
                          onClick={() => setApiType('external')}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                            apiType === 'external' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          API Cơ quan nhà nước (bên ngoài)
                        </button>
                      </div>
                    </div>

                    {apiType === 'internal' && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Chọn API từ danh mục cung cấp dữ liệu <span className="text-red-500">*</span>
                        </label>
                        {internalApis.length > 0 ? (
                          <select
                            value={selectedInternalApiId}
                            onChange={(e) => setSelectedInternalApiId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="">-- Chọn API --</option>
                            {internalApis.map((api: any) => (
                              <option key={api.id} value={api.id}>[{api.method}] {api.name} — {api.endpoint}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="border border-amber-200 bg-amber-50 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            Chưa có API nào được cấu hình trong mục Cung cấp dữ liệu. Vui lòng tạo API trước.
                          </div>
                        )}
                      </div>
                    )}

                    {apiType === 'external' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề API <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Ví dụ: API Danh sách Luật sư VN" value={apiTitle} onChange={(e) => setApiTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Phương thức</label>
                            <select value={apiMethod} onChange={(e) => setApiMethod(e.target.value as any)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">URL API <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="https://api.example.gov.vn/v1/data" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Mô tả API <span className="text-red-500">*</span></label>
                          <textarea rows={2} placeholder="Mô tả về API và dữ liệu trả về..." value={apiDesc} onChange={(e) => setApiDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Tham số (Query Params)</label>
                            <input type="text" placeholder="page=1&limit=100" value={apiParams} onChange={(e) => setApiParams(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Headers</label>
                            <input type="text" placeholder='{"Authorization": "Bearer token"}' value={apiHeaders} onChange={(e) => setApiHeaders(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4 flex items-center justify-between gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors"
                >
                  Hủy
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Lưu nháp
                  </button>
                  <button
                    type="submit"
                    disabled={uploadType === 'file' && !validationSuccess}
                    className={`px-4 py-2 text-white rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm transition-all ${
                      uploadType === 'api' || validationSuccess
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-slate-300 cursor-not-allowed text-slate-500'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Gửi yêu cầu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPROVAL MODAL */}
      {showApprovalModal && selectedApprovalItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-slate-900">Phê duyệt yêu cầu công bố</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Tên tệp đề xuất</div>
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    {selectedApprovalItem.fileName}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">Danh mục mở</div>
                    <div className="text-sm text-slate-800 font-medium mt-0.5">{selectedApprovalItem.category}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">Người đề xuất</div>
                    <div className="text-sm text-slate-800 font-medium mt-0.5">{selectedApprovalItem.creator}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Giấy phép</div>
                  <div className="text-sm text-slate-800 mt-0.5">{selectedApprovalItem.license}</div>
                </div>
              </div>

              {!showRejectForm ? (
                <div className="pt-2">
                  <div className="text-sm font-semibold text-slate-700 mb-2">Xem thử cấu trúc & dữ liệu dòng đầu:</div>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-48 text-[12px]">
                    <table className="w-full border-collapse">
                      <thead className="bg-slate-100">
                        <tr>
                          {selectedApprovalItem.previewHeaders?.map((h, i) => (
                            <th key={i} className="px-3 py-2 text-left font-bold text-slate-600 border-b border-slate-200 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedApprovalItem.previewRows?.map((row, ri) => (
                          <tr key={ri} className="hover:bg-slate-50">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <label className="block text-sm font-semibold text-slate-700">
                    Lý do từ chối phê duyệt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Nhập lý do từ chối cụ thể để cán bộ chỉnh sửa..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-2.5">
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Từ chối duyệt
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApprovalItem)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Phê duyệt & Công bố
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className={`px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all ${rejectReason.trim() ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                  >
                    Xác nhận Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {/* SCHEDULE SETUP MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-slate-900">{isEditingSchedule ? 'Sửa lịch công bố tự động' : 'Thêm lịch công bố tự động'}</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedDataset = APPROVED_CATEGORIES.find(c => c.code === scheduleFormData.datasetId);
                
                if (scheduleFormData.frequency === 'weekly' && (!scheduleFormData.weeklyDays || scheduleFormData.weeklyDays.length === 0)) {
                  alert('Vui lòng chọn ít nhất một thứ trong tuần!');
                  return;
                }

                if (isEditingSchedule && selectedSchedule) {
                  setSchedules(schedules.map(s => s.id === selectedSchedule.id ? {
                    ...s,
                    frequency: scheduleFormData.frequency,
                    startTime: scheduleFormData.startTime,
                    dataSource: scheduleFormData.dataSource,
                    startDate: scheduleFormData.startDate,
                    endDate: scheduleFormData.endDate,
                    publishFormat: scheduleFormData.publishFormat,
                    targetAudience: scheduleFormData.targetAudience,
                    contactInfo: scheduleFormData.contactInfo,
                    weeklyDays: scheduleFormData.weeklyDays,
                    monthlyDay: scheduleFormData.monthlyDay,
                    quarterlyDay: scheduleFormData.quarterlyDay,
                    quarterlyMonth: scheduleFormData.quarterlyMonth,
                    nextRun: `06/06/2026 ${scheduleFormData.startTime}`
                  } : s));
                  alert('Đã cập nhật lịch công bố tự động thành công!');
                } else {
                  if (!matchedDataset) {
                    alert('Vui lòng chọn tập dữ liệu mở!');
                    return;
                  }
                  const newSchedule: ScheduleItem = {
                    id: Date.now(),
                    datasetCode: matchedDataset.code,
                    datasetName: matchedDataset.name,
                    frequency: scheduleFormData.frequency,
                    startTime: scheduleFormData.startTime,
                    startDate: scheduleFormData.startDate,
                    endDate: scheduleFormData.endDate,
                    publishFormat: scheduleFormData.publishFormat,
                    targetAudience: scheduleFormData.targetAudience,
                    contactInfo: scheduleFormData.contactInfo,
                    dataSource: scheduleFormData.dataSource || 'CSDL Kho hệ thống',
                    status: 'active',
                    nextRun: `06/06/2026 ${scheduleFormData.startTime}`,
                    createdBy: 'User',
                    createdDate: new Date().toLocaleDateString('vi-VN'),
                    weeklyDays: scheduleFormData.weeklyDays,
                    monthlyDay: scheduleFormData.monthlyDay,
                    quarterlyDay: scheduleFormData.quarterlyDay,
                    quarterlyMonth: scheduleFormData.quarterlyMonth
                  };
                  setSchedules([newSchedule, ...schedules]);
                  alert('Đã thêm lịch công bố tự động thành công!');
                }
                setShowScheduleModal(false);
              }}
              className="p-6 space-y-4 flex-1 text-[13px]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tập dữ liệu áp dụng *</label>
                  <select
                    disabled={isEditingSchedule}
                    value={scheduleFormData.datasetId}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, datasetId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-500 ${
                      getDatasetFormat(scheduleFormData.datasetId) === 'file' ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">-- Chọn tập dữ liệu mở --</option>
                    {APPROVED_CATEGORIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {getDatasetFormat(scheduleFormData.datasetId) === 'file' && (
                    <div className="text-red-600 font-semibold text-xs mt-1">
                      Tệp dữ liệu không thể tự động cập nhật từ dữ liệu nguồn
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tần suất *</label>
                  <select
                    value={scheduleFormData.frequency}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giờ chạy tự động *</label>
                  <input
                    type="time"
                    required
                    value={scheduleFormData.startTime}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {scheduleFormData.frequency === 'weekly' && (
                  <div className="col-span-2 space-y-1.5">
                    <label className="block font-semibold text-slate-700">Các thứ trong tuần *</label>
                    <div className="flex flex-wrap gap-2">
                      {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day) => {
                        const isSelected = scheduleFormData.weeklyDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const currentDays = scheduleFormData.weeklyDays || [];
                              const newWeeklyDays = isSelected
                                ? currentDays.filter(d => d !== day)
                                : [...currentDays, day];
                              setScheduleFormData({ ...scheduleFormData, weeklyDays: newWeeklyDays });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-medium'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scheduleFormData.frequency === 'monthly' && (
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Ngày trong tháng *</label>
                    <select
                      value={scheduleFormData.monthlyDay || 1}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, monthlyDay: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          Ngày {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {scheduleFormData.frequency === 'quarterly' && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tháng thứ mấy trong quý *</label>
                      <select
                        value={scheduleFormData.quarterlyMonth || 1}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, quarterlyMonth: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value={1}>Tháng thứ nhất</option>
                        <option value={2}>Tháng thứ hai</option>
                        <option value={3}>Tháng thứ ba</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Ngày trong quý (1-30) *</label>
                      <select
                        value={scheduleFormData.quarterlyDay || 1}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, quarterlyDay: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            Ngày {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={scheduleFormData.startDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={scheduleFormData.endDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nguồn cơ sở dữ liệu hệ thống *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: CSDL Trợ giúp pháp lý - Bảng tổ chức"
                    value={scheduleFormData.dataSource}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, dataSource: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Đối tượng khai thác</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Người dân, doanh nghiệp, cơ quan nhà nước..."
                    value={scheduleFormData.targetAudience}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2 bg-white">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={getDatasetFormat(scheduleFormData.datasetId) === 'file'}
                  className={`px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all ${
                    getDatasetFormat(scheduleFormData.datasetId) === 'file'
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SCHEDULE MODAL */}
      {showDeleteScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa lịch</h3>
            <p className="text-sm text-slate-600">
              Bạn có chắc chắn muốn xóa lịch công bố tự động của tập dữ liệu <strong>{selectedSchedule.datasetName}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteScheduleModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
                  setShowDeleteScheduleModal(false);
                  alert('Đã xóa lịch công bố tự động thành công!');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-950">Thành công</h3>
            <p className="text-sm text-slate-600 leading-normal">{successPopupMessage}</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer mt-2"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
}