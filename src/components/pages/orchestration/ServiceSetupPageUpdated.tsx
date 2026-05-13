import React, { useState } from 'react';
import { Plus, Search, Server, Eye, Edit, Trash2, CheckCircle, XCircle, Settings as SettingsIcon, Database, Globe, X, Save, EyeOff, Eye as EyeIcon, FileCheck, FileText, Shield, GitBranch, Clock, AlertCircle, User, Lock, Share, Wifi, FolderOpen, Mail, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { MonitoringPage } from './MonitoringPage';
import { AddProvisionServiceModal } from './AddProvisionServiceModal';
import { ApprovalReviewModal } from './ApprovalReviewModal';
import { GrantPermissionModal } from '../../GrantPermissionModal';

interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'REST' | 'SOAP' | 'GraphQL';
  status: 'active' | 'inactive' | 'maintenance' | 'pending' | 'approved' | 'published' | 'publishing' | 'rejected';
  endpoint: string;
  version: string;
  department: string;
  createdDate: string;
  lastModified: string;
  visibility?: 'public' | 'private'; // Phân loại: Công khai / Không công khai
  maxRequestsPerDay?: number;
  baseUrl?: string;
  httpMethod?: string;
  contentType?: string;
  authType?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  headerName?: string;
  unitCode?: string;
  systemCode?: string;
  isActive?: boolean;
  assignedUnits?: string[]; // Danh sách đơn vị được cấp quyền
  accessStartDate?: string; // Ngày bắt đầu truy cập
}

interface ApprovalRequest {
  id: string;
  apiCode: string;
  apiName: string;
  requestType: 'publish' | 'update' | 'delete';
  submitter: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer?: string;
  reviewDate?: string;
  note?: string;
}

interface LogEntry {
  id: string;
  apiCode: string;
  apiName: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  details: string;
  status: 'success' | 'failed';
}

interface Permission {
  id: string;
  apiCode: string;
  apiName: string;
  user: string;
  organization: string;
  accessType: 'read' | 'write' | 'admin';
  grantDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

interface ApiVersion {
  id: string;
  apiCode: string;
  apiName: string;
  version: string;
  status: 'current' | 'deprecated' | 'retired';
  releaseDate: string;
  endOfLife?: string;
  changelog: string;
  breakingChanges: boolean;
}

interface ApprovalHistory {
  id: string;
  serviceCode: string;
  approvalType: 'service' | 'public'; // Duyệt dịch vụ hoặc Duyệt công khai
  action: 'approved' | 'rejected' | 'pending';
  approver: string;
  approverRole: string;
  timestamp: string;
  note?: string;
  decision?: 'approve' | 'reject' | 'request-change';
}

interface Header {
  key: string;
  value: string;
}

interface QueryParam {
  key: string;
  value: string;
}

interface ServiceForm {
  serviceName: string;
  serviceCode: string;
  dataType: string;
  frequency: string;
  protocol: string;
  accessScope: string;
  sharingPolicy: string;
  description: string;
  category: string;
  selectedTable: string;
  selectedFields: string[];
  visibility?: string; // Phân loại: Công khai / Không công khai
}

const mockServices: Service[] = [
  {
    id: '1',
    code: 'SVC001',
    name: 'Dịch vụ A',
    description: 'API cung cấp dịch vụ A',
    type: 'REST',
    status: 'active',
    endpoint: 'https://api.moj.gov.vn/service-a/v1',
    version: 'v1.2.3',
    department: 'Đơn vị A',
    createdDate: '15/01/2024',
    lastModified: '05/12/2024',
    visibility: 'public',
    maxRequestsPerDay: 10000,
    assignedUnits: ['Đơn vị a', 'Đơn vị b'],
    accessStartDate: '01/01/2024'
  },
  {
    id: '2',
    code: 'SVC002',
    name: 'Dịch vụ B',
    description: 'API cung cấp dịch vụ B',
    type: 'REST',
    status: 'approved',
    endpoint: 'https://api.dldc.moj.gov.vn/v1/api002',
    version: 'v2.1.8',
    department: 'Đơn vị B',
    createdDate: '11/12/2024',
    lastModified: '11/12/2024',
    visibility: 'public',
    maxRequestsPerDay: 50000,
    assignedUnits: ['Đơn vị c']
  },
  {
    id: '3',
    code: 'SVC003',
    name: 'Dịch vụ C',
    description: 'API cung cấp dịch vụ C',
    type: 'SOAP',
    status: 'maintenance',
    endpoint: 'https://api.moj.gov.vn/service-c/v1',
    version: 'v1.0.5',
    department: 'Đơn vị C',
    createdDate: '10/03/2024',
    lastModified: '08/12/2024',
    visibility: 'private'
  },
  {
    id: '4',
    code: 'SVC004',
    name: 'API Tra cứu Đăng ký Kinh doanh',
    description: 'API chia sẻ dữ liệu DKKD cho Bộ Kế hoạch và Đầu tư',
    type: 'REST',
    status: 'approved',
    endpoint: 'https://api.moj.gov.vn/dkkd/v1',
    version: 'v1.0.0',
    department: 'Phòng CNTT',
    createdDate: '14/04/2025',
    lastModified: '14/04/2025',
    visibility: 'public',
    maxRequestsPerDay: 10000
  },
];

const mockApprovals: ApprovalRequest[] = [
  {
    id: 'APR001',
    apiCode: 'SVC002',
    apiName: 'Dịch vụ B',
    requestType: 'publish',
    submitter: 'Nguyễn Văn A',
    submitDate: '15/04/2025 10:30',
    status: 'pending',
    note: 'Yêu cầu công bố dịch vụ B (đã hoàn thiện cấu hình kết nối)'
  },
  {
    id: 'APR002',
    apiCode: 'SVC004',
    apiName: 'API Tra cứu Đăng ký Kinh doanh',
    requestType: 'publish',
    submitter: 'Phạm Minh D',
    submitDate: '14/04/2025 09:15',
    status: 'pending',
    note: 'Gửi phê duyệt dịch vụ chia sẻ DKKD cho Bộ KH&ĐT'
  },
  {
    id: 'APR003',
    apiCode: 'SVC001',
    apiName: 'Dịch vụ A',
    requestType: 'update',
    submitter: 'Trần Thị B',
    submitDate: '10/04/2025 14:20',
    status: 'approved',
    reviewer: 'Lê Văn C',
    reviewDate: '12/04/2025 09:15',
    note: 'Cập nhật tần suất đồng bộ'
  }
];

const mockLogs: LogEntry[] = [
  {
    id: 'LOG001',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    action: 'API Call',
    user: 'system@dldc.gov.vn',
    timestamp: '17/12/2024 14:35:22',
    ip: '192.168.1.105',
    details: 'Truy vấn thành công - 1 bản ghi',
    status: 'success'
  },
  {
    id: 'LOG002',
    apiCode: 'API002',
    apiName: 'API nhận dữ liệu đăng ký kinh doanh',
    action: 'Configuration Update',
    user: 'admin@dldc.gov.vn',
    timestamp: '17/12/2024 14:30:15',
    ip: '10.0.0.50',
    details: 'Cập nhật endpoint từ /v1 sang /v2',
    status: 'success'
  },
  {
    id: 'LOG003',
    apiCode: 'API003',
    apiName: 'API cập nhật thông tin văn bản pháp luật',
    action: 'API Call',
    user: 'external@partner.vn',
    timestamp: '17/12/2024 14:25:48',
    ip: '203.162.10.25',
    details: 'Xác thực thất bại - API Key không hợp lệ',
    status: 'failed'
  },
  {
    id: 'LOG004',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    action: 'Permission Grant',
    user: 'admin@dldc.gov.vn',
    timestamp: '17/12/2024 14:20:10',
    ip: '10.0.0.50',
    details: 'Cấp quyền đọc cho user@local.gov.vn',
    status: 'success'
  },
  {
    id: 'LOG005',
    apiCode: 'API006',
    apiName: 'API xuất dữ liệu báo cáo thống kê',
    action: 'API Call',
    user: 'report@ministry.gov.vn',
    timestamp: '17/12/2024 14:15:33',
    ip: '172.16.0.100',
    details: 'Xuất báo cáo - 15,234 bản ghi',
    status: 'success'
  }
];

const mockPermissions: Permission[] = [
  {
    id: 'PERM001',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    user: 'user1@local.gov.vn',
    organization: 'Sở Tư pháp Hà Nội',
    accessType: 'read',
    grantDate: '01/01/2024',
    expiryDate: '31/12/2024',
    status: 'active'
  },
  {
    id: 'PERM002',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    user: 'admin@central.gov.vn',
    organization: 'Bộ Tư pháp',
    accessType: 'admin',
    grantDate: '01/01/2024',
    expiryDate: '31/12/2025',
    status: 'active'
  },
  {
    id: 'PERM003',
    apiCode: 'API002',
    apiName: 'API nhận dữ liệu đăng ký kinh doanh',
    user: 'partner@external.vn',
    organization: 'Đối tác bên ngoài',
    accessType: 'write',
    grantDate: '01/06/2024',
    expiryDate: '30/11/2024',
    status: 'expired'
  },
  {
    id: 'PERM004',
    apiCode: 'API003',
    apiName: 'API cập nhật thông tin văn bản pháp luật',
    user: 'legal@department.gov.vn',
    organization: 'Vụ Pháp luật',
    accessType: 'write',
    grantDate: '15/03/2024',
    expiryDate: '15/03/2025',
    status: 'active'
  },
  {
    id: 'PERM005',
    apiCode: 'API005',
    apiName: 'API nhận yêu cầu trợ giúp pháp lý',
    user: 'aid@center.gov.vn',
    organization: 'Trung tâm TGPL',
    accessType: 'read',
    grantDate: '10/02/2024',
    expiryDate: '10/02/2025',
    status: 'revoked'
  }
];

const mockVersions: ApiVersion[] = [
  {
    id: 'VER001',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    version: 'v2.1.0',
    status: 'current',
    releaseDate: '01/12/2024',
    changelog: 'Thêm trường số CCCD, tối ưu performance',
    breakingChanges: false
  },
  {
    id: 'VER002',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    version: 'v2.0.0',
    status: 'deprecated',
    releaseDate: '01/06/2024',
    endOfLife: '01/06/2025',
    changelog: 'Thay đổi cấu trúc response, thêm pagination',
    breakingChanges: true
  },
  {
    id: 'VER003',
    apiCode: 'API001',
    apiName: 'API tra cứu thông tin công dân',
    version: 'v1.0.0',
    status: 'retired',
    releaseDate: '01/01/2024',
    endOfLife: '01/12/2024',
    changelog: 'Phiên bản đầu tiên',
    breakingChanges: false
  },
  {
    id: 'VER004',
    apiCode: 'API002',
    apiName: 'API nhận dữ liệu đăng ký kinh doanh',
    version: 'v1.5.2',
    status: 'current',
    releaseDate: '15/11/2024',
    changelog: 'Sửa lỗi validation, cải thiện error handling',
    breakingChanges: false
  },
  {
    id: 'VER005',
    apiCode: 'API003',
    apiName: 'API cập nhật thông tin văn bản pháp luật',
    version: 'v3.0.0',
    status: 'current',
    releaseDate: '20/11/2024',
    changelog: 'Hỗ trợ batch update, thêm webhook notification',
    breakingChanges: true
  },
  {
    id: 'VER006',
    apiCode: 'API002',
    apiName: 'API nhận dữ liệu đăng ký kinh doanh',
    version: 'v1.4.0',
    status: 'deprecated',
    releaseDate: '10/08/2024',
    endOfLife: '10/02/2025',
    changelog: 'Thêm tính năng tìm kiếm nâng cao, sửa lỗi encoding',
    breakingChanges: false
  },
  {
    id: 'VER007',
    apiCode: 'API004',
    apiName: 'API đồng bộ dữ liệu công chứng',
    version: 'v2.1.3',
    status: 'current',
    releaseDate: '05/12/2024',
    changelog: 'Cập nhật xử lý chữ ký số, tối ưu hiệu năng đồng bộ',
    breakingChanges: false
  },
  {
    id: 'VER008',
    apiCode: 'API005',
    apiName: 'API tra cứu dữ liệu trợ giúp pháp lý',
    version: 'v1.2.0',
    status: 'current',
    releaseDate: '22/11/2024',
    changelog: 'Thêm API endpoint mới cho thống kê, cải thiện bảo mật',
    breakingChanges: false
  },
  {
    id: 'VER009',
    apiCode: 'API003',
    apiName: 'API cập nhật thông tin văn bản pháp luật',
    version: 'v2.5.1',
    status: 'deprecated',
    releaseDate: '15/09/2024',
    endOfLife: '15/03/2025',
    changelog: 'Cải tiến search, thêm filters mới',
    breakingChanges: false
  }
];

export function ServiceSetupPage() {
  const [activeTab, setActiveTab] = useState<'setup' | 'passive-data' | 'monitoring' | 'permissions' | 'versions' | 'approvals' | 'public'>('setup');
  const [services, setServices] = useState<Service[]>(mockServices);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [versions, setVersions] = useState<ApiVersion[]>(mockVersions);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [approvalSubTab, setApprovalSubTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPublicType, setFilterPublicType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | 'approve'>('add');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubmitApprovalModal, setShowSubmitApprovalModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showGrantPermissionModal, setShowGrantPermissionModal] = useState(false);
  const [showApprovalReviewModal, setShowApprovalReviewModal] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [serviceToPublish, setServiceToPublish] = useState<Service | null>(null);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  
  // Grant Permission Wizard State
  const [grantStep, setGrantStep] = useState(1);
  const [selectedApiForGrant, setSelectedApiForGrant] = useState<Service | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [grantPermissions, setGrantPermissions] = useState({
    read: true,
    write: false,
    update: false,
    delete: false
  });
  const [maxCallsPerDay, setMaxCallsPerDay] = useState('1000');
  const [allowedIPs, setAllowedIPs] = useState<string[]>(['']);
  const [contactPerson, setContactPerson] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [validUntil, setValidUntil] = useState('');
  
  // Version Management State
  const [selectedVersion, setSelectedVersion] = useState<ApiVersion | null>(null);
  const [showVersionDetailModal, setShowVersionDetailModal] = useState(false);
  const [versionForm, setVersionForm] = useState({
    apiCode: '',
    version: '',
    releaseDate: '',
    endOfLife: '',
    changelog: '',
    breakingChanges: false,
    status: 'current' as 'current' | 'deprecated' | 'retired'
  });
  
  const [headers, setHeaders] = useState<Header[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Lịch sử phê duyệt (mock data)
  const [approvalHistories] = useState<ApprovalHistory[]>([
    {
      id: 'AH001',
      serviceCode: 'SRV001',
      approvalType: 'service',
      action: 'approved',
      approver: 'Nguyễn Văn A',
      approverRole: 'Trưởng phòng CNTT',
      timestamp: '20/12/2024 10:30',
      note: 'Dịch vụ đã được kiểm tra kỹ thuật và phê duyệt',
      decision: 'approve'
    },
    {
      id: 'AH002',
      serviceCode: 'SRV001',
      approvalType: 'public',
      action: 'approved',
      approver: 'Trần Thị B',
      approverRole: 'Phó Giám đốc',
      timestamp: '21/12/2024 14:15',
      note: 'Đồng ý công khai dịch vụ',
      decision: 'approve'
    },
    {
      id: 'AH003',
      serviceCode: 'SRV002',
      approvalType: 'service',
      action: 'approved',
      approver: 'Nguyễn Văn A',
      approverRole: 'Trưởng phòng CNTT',
      timestamp: '18/12/2024 09:20',
      note: 'Phê duyệt dịch vụ',
      decision: 'approve'
    },
    {
      id: 'AH004',
      serviceCode: 'SRV003',
      approvalType: 'service',
      action: 'pending',
      approver: '',
      approverRole: '',
      timestamp: '22/12/2024 08:00',
      note: 'Đang chờ phê duyệt'
    }
  ]);
  
  const [formData, setFormData] = useState<Partial<Service>>({
    code: '',
    name: '',
    description: '',
    type: 'REST',
    status: 'active',
    endpoint: '',
    version: '',
    department: '',
    maxRequestsPerDay: undefined,
    baseUrl: '',
    httpMethod: 'GET',
    contentType: 'JSON',
    authType: 'none',
    username: '',
    password: '',
    apiKey: '',
    headerName: 'x-api-key',
    unitCode: '',
    systemCode: '',
    isActive: false
  });

  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    serviceName: '',
    serviceCode: '',
    dataType: '',
    frequency: '',
    protocol: '',
    accessScope: '',
    sharingPolicy: '',
    description: '',
    category: '',
    selectedTable: '',
    selectedFields: []
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesType = filterType === 'all' || service.type === filterType;
    const matchesPublicType = filterPublicType === 'all' || service.visibility === filterPublicType;
    return matchesSearch && matchesStatus && matchesType && matchesPublicType;
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.apiName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.apiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredApprovals = approvals.filter(a => {
    const matchesSearch = a.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.apiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.submitter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = approvalSubTab === 'all' || a.status === approvalSubTab;
    return matchesSearch && matchesTab;
  });

  const filteredPermissions = permissions.filter(perm =>
    perm.apiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perm.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perm.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perm.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVersions = versions.filter(ver =>
    ver.apiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ver.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ver.version.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedService(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setModalMode('edit');
    setShowAddModal(true);
  };

  const handleOpenViewModal = (service: Service) => {
    setSelectedService(service);
    setModalMode('view');
    setShowAddModal(true);
  };

  const handlePublishService = (serviceId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, status: 'publishing' } : s
    ));
    
    // Giả lập quá trình công khai tự động
    setTimeout(() => {
      setServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, status: 'published' } : s
      ));
      alert('Dịch vụ đã được công khai tự động lên Cổng dữ liệu dùng chung thành công!');
    }, 2000);
  };

  const handleCloseServiceForm = () => {
    setShowAddModal(false);
    setSelectedService(null);
  };

  const handleServiceFormChange = (field: keyof ServiceForm, value: string) => {
    setServiceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tạo dịch vụ mới với status = 'active' vì đã được phê duyệt ngay
    const newService: Service = {
      id: Date.now().toString(),
      code: serviceForm.serviceCode,
      name: serviceForm.serviceName,
      description: serviceForm.description,
      type: serviceForm.protocol.toUpperCase() as any,
      endpoint: `https://api.dldc.moj.gov.vn/v1/${serviceForm.serviceCode}`,
      version: '1.0.0',
      department: 'Đơn vị mới',
      status: 'active', // Hoạt động ngay vì thêm trực tiếp
      visibility: serviceForm.visibility as 'public' | 'private' || 'public',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      lastModified: new Date().toLocaleDateString('vi-VN')
    };
    
    setServices([...services, newService]);
    console.log('Service added directly:', newService);
    handleCloseServiceForm();
  };

  const getStatusBadge = (status: string) => {
    const labels = {
      active: 'Hoạt động',
      inactive: 'Chưa hoạt động',
      maintenance: 'Bảo trì',
      pending: 'Đang phê duyệt',
      approved: 'Đã phê duyệt',
      published: 'Đang công khai',
      publishing: 'Đang xử lý công khai'
    };
    const variants = {
      active: 'green',
      inactive: 'slate',
      maintenance: 'amber',
      pending: 'orange',
      approved: 'blue',
      published: 'indigo',
      publishing: 'purple'
    };
    return (
      <StatusTag 
        label={labels[status as keyof typeof labels]} 
        variant={variants[status as keyof typeof variants] as any} 
      />
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <StatusTag 
        label={type} 
        variant={type === 'REST' ? 'blue' : type === 'SOAP' ? 'purple' : 'pink'} 
      />
    );
  };

  const getVisibilityBadge = (visibility?: string) => {
    const vis = visibility || 'private';
    return (
      <StatusTag 
        label={vis === 'public' ? 'Công khai' : 'Không công khai'} 
        variant={vis === 'public' ? 'blue' : 'slate'} 
      />
    );
  };

  const getRequestTypeBadge = (type: string) => {
    const labels = {
      publish: 'Công bố',
      update: 'Cập nhật',
      delete: 'Xóa'
    };
    return (
      <StatusTag 
        label={labels[type as keyof typeof labels]} 
        variant={type === 'publish' ? 'green' : type === 'update' ? 'blue' : 'red'} 
      />
    );
  };

  const getApprovalStatusBadge = (status: string) => {
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };
    return (
      <StatusTag 
        label={labels[status as keyof typeof labels]} 
        variant={status === 'pending' ? 'amber' : status === 'approved' ? 'green' : 'red'} 
      />
    );
  };

  const getLogStatusBadge = (status: string) => {
    return (
      <StatusTag 
        label={status === 'success' ? 'Thành công' : 'Thất bại'} 
        variant={status === 'success' ? 'green' : 'red'} 
      />
    );
  };

  const getAccessTypeBadge = (type: string) => {
    const styles = {
      read: 'bg-blue-100 text-blue-700 border-blue-200',
      write: 'bg-amber-100 text-amber-700 border-amber-200',
      admin: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    const labels = {
      read: 'Đọc',
      write: 'Ghi',
      admin: 'Quản trị'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getPermissionStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      expired: 'bg-slate-100 text-slate-600 border-slate-200',
      revoked: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      active: 'Hoạt động',
      expired: 'Hết hạn',
      revoked: 'Thu hồi'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getVersionStatusBadge = (status: string) => {
    const styles = {
      current: 'bg-green-100 text-green-700 border-green-200',
      deprecated: 'bg-amber-100 text-amber-700 border-amber-200',
      retired: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    const labels = {
      current: 'Hiện tại',
      deprecated: 'Sắp ngừng',
      retired: 'Đã ngừng'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatNumber = (num?: number) => {
    if (!num) return 'Không giới hạn';
    return num.toLocaleString('vi-VN');
  };

  const handleApprove = (id: string) => {
    setApprovals(approvals.map(a =>
      a.id === id ? { 
        ...a, 
        status: 'approved', 
        reviewer: 'Admin User',
        reviewDate: new Date().toLocaleString('vi-VN')
      } : a
    ));
    
    // Cập nhật service status thành 'active' khi được phê duyệt
    // Nhưng vẫn giữ visibility = 'private' cho đến khi admin chủ động đổi
    setServices(services.map(s =>
      s.id === id ? { ...s, status: 'active' } : s
    ));
    
    setSelectedApproval(null);
  };

  const handleReject = (id: string, note: string) => {
    setApprovals(approvals.map(a =>
      a.id === id ? { 
        ...a, 
        status: 'rejected', 
        reviewer: 'Admin User',
        reviewDate: new Date().toLocaleString('vi-VN'),
        note
      } : a
    ));
    
    // Cập nhật service status thành 'inactive' và visibility = 'private' khi bị từ chối
    setServices(services.map(s =>
      s.id === id ? { ...s, status: 'inactive', visibility: 'private' } : s
    ));
    
    setSelectedApproval(null);
  };

  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    inactive: services.filter(s => s.status === 'inactive').length,
    maintenance: services.filter(s => s.status === 'maintenance').length,
    pending: services.filter(s => s.status === 'pending').length
  };

  const approvalStats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length
  };

  const logStats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    today: logs.filter(l => l.timestamp.startsWith('17/12/2024')).length
  };

  const permissionStats = {
    total: permissions.length,
    active: permissions.filter(p => p.status === 'active').length,
    expired: permissions.filter(p => p.status === 'expired').length,
    revoked: permissions.filter(p => p.status === 'revoked').length
  };

  const versionStats = {
    total: versions.length,
    current: versions.filter(v => v.status === 'current').length,
    deprecated: versions.filter(v => v.status === 'deprecated').length,
    retired: versions.filter(v => v.status === 'retired').length
  };

  const publicStats = {
    total: services.filter(s => s.visibility === 'public').length,
    eligible: services.filter(s => (s.status === 'approved' || s.status === 'active') && s.visibility === 'public').length,
    published: services.filter(s => s.status === 'published' || s.status === 'active').length,
    publishing: services.filter(s => s.status === 'publishing').length
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'setup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Thiết lập dịch vụ
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'versions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Quản lý phiên bản API
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'monitoring'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Giám sát & Log
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Phê duyệt
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'approvals' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
              {approvals.filter(a => a.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'public'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Công khai
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'public' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
              {services.filter(s => s.visibility === 'public' && (s.status === 'approved' || s.status === 'published' || s.status === 'publishing' || s.status === 'active')).length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'monitoring' && <MonitoringPage />}
      
      {activeTab === 'setup' && (
        <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng số dịch vụ</div>
              <div className="text-sm text-slate-900 mt-0.5">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Đang hoạt động</div>
              <div className="text-sm text-slate-900 mt-0.5">{stats.active}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Công khai</div>
              <div className="text-sm text-slate-900 mt-0.5">{services.filter(s => s.visibility === 'public').length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Chưa hoạt động</div>
              <div className="text-sm text-slate-900 mt-0.5">{stats.inactive}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="grid grid-cols-5 gap-3">
          <div className="relative">
            <label htmlFor="service-search" className="sr-only">Tìm kiếm dịch vụ</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="service-search"
              type="text"
              aria-label="Tìm kiếm dịch vụ"
              title="Tìm kiếm theo tên, mã dịch vụ, đơn vị..."
              placeholder="Tìm kiếm theo tên, mã dịch vụ, đơn vị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="filter-status" className="sr-only">Lọc theo trạng thái</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Lọc theo trạng thái"
              title="Lọc theo trạng thái"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Chưa hoạt động</option>
              <option value="maintenance">Đang bảo trì</option>
              <option value="pending">Đang phê duyệt</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-type" className="sr-only">Lọc theo loại dịch vụ</label>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Lọc theo loại dịch vụ"
              title="Lọc theo loại dịch vụ"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại dịch vụ</option>
              <option value="REST">REST API</option>
              <option value="SOAP">SOAP</option>
              <option value="GraphQL">GraphQL</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-public" className="sr-only">Lọc theo phân loại</label>
            <select
              id="filter-public"
              value={filterPublicType}
              onChange={(e) => setFilterPublicType(e.target.value)}
              aria-label="Lọc theo phân loại"
              title="Lọc theo phân loại"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả phân loại</option>
              <option value="public">Công khai</option>
              <option value="private">Không công khai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Service Button */}
      <div className="flex items-center justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={handleOpenAddModal}>
          <Plus className="w-4 h-4" />
          Thêm dịch vụ mới
        </button>
      </div>

      {/* Service List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã dịch vụ</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên dịch vụ</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phiên bản</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đơn vị quản lý</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phân loại</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không tìm thấy dịch vụ phù hợp
                  </td>
                </tr>
              ) : (
                filteredServices.map((service, index) => (
                  <tr key={service.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        onClick={() => {
                          setSelectedService(service);
                          setModalMode('view');
                          setShowAddModal(true);
                        }}
                        className="px-2 py-0.5 bg-slate-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded text-xs transition-all font-mono"
                      >
                        {service.code}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-900">{service.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{service.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{getTypeBadge(service.type)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <code className="text-xs">{service.version}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{service.department}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(service.status)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        service.visibility === 'public' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {service.visibility === 'public' ? 'Công khai' : 'Không công khai'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">

                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" 
                          title="Xem chi tiết"
                          aria-label={`Xem chi tiết dịch vụ ${service.name}`}
                          onClick={() => {
                            setSelectedService(service);
                            setModalMode('view');
                            setShowAddModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" 
                          title="Chỉnh sửa"
                          aria-label={`Chỉnh sửa dịch vụ ${service.name}`}
                          onClick={() => handleOpenEditModal(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-slate-600 hover:bg-slate-50 rounded" 
                          title="Cấu hình"
                          aria-label={`Cấu hình dịch vụ ${service.name}`}
                          onClick={() => {
                            setSelectedService(service);
                            setShowConfigModal(true);
                          }}
                        >
                          <SettingsIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" 
                          title="Trình duyệt"
                          aria-label={`Trình duyệt dịch vụ ${service.name}`}
                          onClick={() => {
                            setSelectedService(service);
                            setShowSubmitApprovalModal(true);
                          }}
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded" 
                          title="Duyệt"
                          aria-label={`Phê duyệt dịch vụ ${service.name}`}
                          onClick={() => {
                            setSelectedService(service);
                            setModalMode('approve');
                            setShowAddModal(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                          title="Xóa"
                          aria-label={`Xóa dịch vụ ${service.name}`}
                          onClick={() => {
                            setSelectedService(service);
                            setShowDeleteModal(true);
                          }}
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
      </div>
    </div>
      )}



      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* 1. Dashboard Thống kê (Stat Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border-l-4 border-l-amber-500 shadow-sm p-5 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">Chờ phê duyệt</p>
                <p className="text-3xl font-bold text-slate-800">{approvalStats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border-l-4 border-l-green-500 shadow-sm p-5 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Đã phê duyệt</p>
                <p className="text-3xl font-bold text-slate-800">{approvalStats.approved}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                <FileCheck className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-l-red-500 shadow-sm p-5 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Từ chối</p>
                <p className="text-3xl font-bold text-slate-800">{approvalStats.rejected}</p>
              </div>
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <XCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* 2. Bộ lọc phụ & Tìm kiếm */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex flex-wrap items-center bg-slate-50/50 border-b border-slate-100 px-2 py-1.5 gap-1">
              {[
                { id: 'all', label: 'Tất cả', count: approvalStats.total },
                { id: 'pending', label: 'Chờ phê duyệt', count: approvalStats.pending },
                { id: 'approved', label: 'Đã phê duyệt', count: approvalStats.approved },
                { id: 'rejected', label: 'Từ chối', count: approvalStats.rejected },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setApprovalSubTab(sub.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                    approvalSubTab === sub.id
                      ? 'bg-white shadow-sm ring-1 ring-slate-200 text-blue-600'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {sub.label}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    approvalSubTab === sub.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-4 bg-white">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="approval-search-input"
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã danh mục..."
                  aria-label="Tìm kiếm yêu cầu phê duyệt"
                  title="Tìm kiếm theo tên, mã danh mục..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* 3. Danh sách Card yêu cầu */}
          <div className="space-y-4">
            {filteredApprovals.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-blue-300 transition-colors group">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-800">{app.apiName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status === 'pending' ? 'Chờ phê duyệt' : app.status === 'approved' ? 'Đã phê duyệt' : 'Từ chối'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors uppercase">
                        {app.apiCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
 onClick={() => {
 const service = services.find(s => s.code === app.apiCode);
 if (service) {
 setSelectedService(service);
 setModalMode('approve');
 setShowAddModal(true);
 } else {
 alert('Không tìm thấy thông tin chi tiết của dịch vụ này.');
 }
 }}
 className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-sm shadow-blue-100 transition-all active:scale-95"
 >
 <Eye className="w-4 h-4" />
 Kiểm tra và phê duyệt
 </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Cơ quan quản lý</p>
                    <p className="text-sm font-medium text-slate-700">Bộ Tư pháp</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Loại dữ liệu</p>
                    <p className="text-sm font-medium text-slate-700">Văn bản pháp luật</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Người gửi</p>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-slate-700">{app.submitter}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Ngày gửi</p>
                    <p className="text-sm font-medium text-slate-700">{app.submitDate}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full border border-blue-100 flex items-center gap-1">
                    <Database className="w-3 h-3" /> 12 thuộc tính
                  </span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-medium rounded-full border border-purple-100 flex items-center gap-1">
                    <Share className="w-3 h-3" /> 3 quan hệ
                  </span>
                  <span className="px-2 py-1 bg-pink-50 text-pink-600 text-[10px] font-medium rounded-full border border-pink-100 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> 2 đính kèm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {activeTab === 'public' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* 1. Dashboard Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Tổng dịch vụ công khai</p>
                <p className="text-xl font-bold text-slate-900">{publicStats.total}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Chờ công khai</p>
                <p className="text-xl font-bold text-slate-900">{publicStats.eligible}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Share className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Đang công khai</p>
                <p className="text-xl font-bold text-slate-900">{publicStats.published}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                <SettingsIcon className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Đang xử lý</p>
                <p className="text-xl font-bold text-slate-900">{publicStats.publishing}</p>
              </div>
            </div>
          </div>

          {/* 2. Filters */}
          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="public-service-search"
                type="text"
                placeholder="Tìm kiếm dịch vụ công khai..."
                aria-label="Tìm kiếm dịch vụ công khai"
                title="Tìm kiếm dịch vụ công khai..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 3. Service List */}
          <div className="space-y-4">
            {services.filter(s => 
              s.visibility === 'public' && 
              (s.status === 'approved' || s.status === 'published' || s.status === 'publishing' || s.status === 'active') &&
              (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((service) => (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Globe className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{service.name}</h4>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded uppercase">{service.code}</span>
                        <span>•</span>
                        <span>{service.department}</span>
                        <span>•</span>
                        <span>v{service.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.status === 'approved' ? (
                      <button 
                        onClick={() => handlePublishService(service.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-sm transition-all active:scale-95"
                      >
                        <Share className="w-4 h-4" />
                        Công khai dịch vụ
                      </button>
                    ) : service.status === 'publishing' ? (
                      <button className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg flex items-center gap-2 text-sm font-medium cursor-not-allowed" disabled>
                        <SettingsIcon className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg flex items-center gap-2 text-sm font-medium cursor-default">
                        <CheckCircle className="w-4 h-4" />
                        Đã công khai
                      </button>
                    )}
                    <button 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Loại dịch vụ</p>
                    <div className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-sm text-slate-700 font-medium">{service.type}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cổng dữ liệu</p>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm text-slate-700 font-medium">Cổng dữ liệu dùng chung</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ngày phê duyệt</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm text-slate-700 font-medium">15/04/2025</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                     {service.status === 'published' || service.status === 'active' ? (
                       <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Wifi className="w-3 h-3" /> Online
                       </span>
                     ) : (
                       <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Offline
                       </span>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Tab Quản lý phiên bản API */}
      {activeTab === 'versions' && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Tổng phiên bản</p>
                  <p className="text-2xl text-slate-900 mt-1">{versionStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Hiện tại</p>
                  <p className="text-2xl text-slate-900 mt-1">{versionStats.current}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Sắp ngừng</p>
                  <p className="text-2xl text-slate-900 mt-1">{versionStats.deprecated}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Đã ngừng</p>
                  <p className="text-2xl text-slate-900 mt-1">{versionStats.retired}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="version-search-input"
                  type="text"
                  placeholder="Tìm kiếm theo mã API, tên API hoặc phiên bản..."
                  aria-label="Tìm kiếm theo mã API, tên API hoặc phiên bản"
                  title="Tìm kiếm theo mã API, tên API hoặc phiên bản..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-slate-600">
                Tìm thấy <span className="font-semibold text-slate-900">{filteredVersions.length}</span> phiên bản
              </div>
            </div>
          </div>

          {/* Add Version Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowVersionModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Thêm phiên bản</span>
            </button>
          </div>

          {/* Version List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã API</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên API</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phiên bản</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày phát hành</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày kết thúc</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thay đổi không tương thích</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVersions.map((version) => (
                    <tr key={version.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">{version.apiCode}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{version.apiName}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <code className="text-xs font-mono">{version.version}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{version.releaseDate}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{version.endOfLife || '-'}</td>
                      <td className="px-6 py-4">
                        {version.breakingChanges ? (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full">Có</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">Không</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getVersionStatusBadge(version.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Xem chi tiết"
                            aria-label="Xem chi tiết"
                            onClick={() => {
                              setSelectedVersion(version);
                              setShowVersionDetailModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Form Modal */}
      <AddProvisionServiceModal 
        isOpen={showAddModal} 
        onClose={handleCloseServiceForm} 
        mode={modalMode}
        data={selectedService}
      />

      {/* Modal Thêm phiên bản mới */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Thêm phiên bản API mới</h3>
                  <p className="text-sm text-purple-100 mt-0.5">Tạo phiên bản mới cho API</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowVersionModal(false);
                  setVersionForm({
                    apiCode: '',
                    version: '',
                    releaseDate: '',
                    endOfLife: '',
                    changelog: '',
                    breakingChanges: false,
                    status: 'current'
                  });
                }}
                aria-label="Đóng thêm phiên bản"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {/* Select API */}
                <div>
                  <label htmlFor="version-api-select" className="block text-sm text-slate-700 mb-2">
                    Chọn API <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="version-api-select"
                    title="Chọn API để thêm phiên bản"
                    value={versionForm.apiCode}
                    onChange={(e) => setVersionForm({ ...versionForm, apiCode: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">-- Chọn API --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.code}>
                        {service.code} - {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Version Number */}
                <div>
                  <label htmlFor="version-number-input" className="block text-sm text-slate-700 mb-2">
                    Số phiên bản <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="version-number-input"
                    type="text"
                    title="Nhập số phiên bản (vd: v1.0.0)"
                    value={versionForm.version}
                    onChange={(e) => setVersionForm({ ...versionForm, version: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="v2.0.0"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Ví dụ: v1.0.0, v2.1.5</p>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="version-status-select" className="block text-sm text-slate-700 mb-2">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="version-status-select"
                    title="Chọn trạng thái phiên bản"
                    aria-label="Chọn trạng thái phiên bản"
                    value={versionForm.status}
                    onChange={(e) => setVersionForm({ ...versionForm, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="current">Hiện tại</option>
                    <option value="deprecated">Sắp ngừng</option>
                    <option value="retired">Đã ngừng</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="version-release-date" className="block text-sm text-slate-700 mb-2">
                      Ngày phát hành <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="version-release-date"
                      type="date"
                      title="Chọn ngày phát hành"
                      aria-label="Chọn ngày phát hành"
                      value={versionForm.releaseDate}
                      onChange={(e) => setVersionForm({ ...versionForm, releaseDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="version-end-date" className="block text-sm text-slate-700 mb-2">
                      Ngày kết thúc
                    </label>
                    <input
                      id="version-end-date"
                      type="date"
                      title="Chọn ngày kết thúc (nếu có)"
                      aria-label="Chọn ngày kết thúc (nếu có)"
                      value={versionForm.endOfLife}
                      onChange={(e) => setVersionForm({ ...versionForm, endOfLife: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Breaking Changes */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="breaking-changes-checkbox"
                      title="Có Breaking Changes"
                      aria-label="Có Breaking Changes (thay đổi không tương thích ngược)"
                      checked={versionForm.breakingChanges}
                      onChange={(e) => setVersionForm({ ...versionForm, breakingChanges: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">
                      Có Breaking Changes (thay đổi không tương thích ngược)
                    </span>
                  </label>
                </div>

                {/* Changelog */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Changelog <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="version-changelog"
                    title="Nhập mô tả các thay đổi"
                    aria-label="Changelog: Mô tả các thay đổi trong phiên bản này"
                    value={versionForm.changelog}
                    onChange={(e) => setVersionForm({ ...versionForm, changelog: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Mô tả các thay đổi trong phiên bản này..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowVersionModal(false);
                  setVersionForm({
                    apiCode: '',
                    version: '',
                    releaseDate: '',
                    endOfLife: '',
                    changelog: '',
                    breakingChanges: false,
                    status: 'current'
                  });
                }}
                className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!versionForm.apiCode || !versionForm.version || !versionForm.releaseDate || !versionForm.changelog) {
                    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
                    return;
                  }

                  const selectedApiService = services.find(s => s.code === versionForm.apiCode);
                  const newVersion: ApiVersion = {
                    id: `VER${(versions.length + 1).toString().padStart(3, '0')}`,
                    apiCode: versionForm.apiCode,
                    apiName: selectedApiService?.name || '',
                    version: versionForm.version,
                    status: versionForm.status,
                    releaseDate: new Date(versionForm.releaseDate).toLocaleDateString('vi-VN'),
                    endOfLife: versionForm.endOfLife ? new Date(versionForm.endOfLife).toLocaleDateString('vi-VN') : undefined,
                    changelog: versionForm.changelog,
                    breakingChanges: versionForm.breakingChanges
                  };

                  setVersions([...versions, newVersion]);
                  setShowVersionModal(false);
                  setVersionForm({
                    apiCode: '',
                    version: '',
                    releaseDate: '',
                    endOfLife: '',
                    changelog: '',
                    breakingChanges: false,
                    status: 'current'
                  });

                  alert(`Đã tạo phiên bản ${newVersion.version} cho API ${newVersion.apiCode} thành công!`);
                }}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tạo phiên bản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết phiên bản */}
      {showVersionDetailModal && selectedVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Chi tiết phiên bản</h3>
                  <p className="text-sm text-indigo-100 mt-0.5 font-mono">{selectedVersion.version}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowVersionDetailModal(false);
                  setSelectedVersion(null);
                }}
                aria-label="Đóng"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* API Info */}
                <div>
                  <h4 className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Thông tin API
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Mã API</p>
                      <code className="text-sm text-blue-700">{selectedVersion.apiCode}</code>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Tên API</p>
                      <p className="text-sm text-slate-900">{selectedVersion.apiName}</p>
                    </div>
                  </div>
                </div>

                {/* Version Info */}
                <div>
                  <h4 className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Thông tin phiên bản
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Số phiên bản</p>
                      <code className="text-base font-mono text-slate-900">{selectedVersion.version}</code>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Trạng thái</p>
                      <div className="mt-2">{getVersionStatusBadge(selectedVersion.status)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Ngày phát hành</p>
                        <p className="text-sm text-slate-900">{selectedVersion.releaseDate}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Ngày kết thúc</p>
                        <p className="text-sm text-slate-900">{selectedVersion.endOfLife || 'Chưa xác định'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Breaking Changes</p>
                      {selectedVersion.breakingChanges ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Có thay đổi không tương thích
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Tương thích ngược
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Changelog */}
                <div>
                  <h4 className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Changelog
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedVersion.changelog}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setShowVersionDetailModal(false);
                  setSelectedVersion(null);
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Permission Modal */}
      <GrantPermissionModal
        isOpen={showGrantPermissionModal}
        onClose={() => setShowGrantPermissionModal(false)}
        services={services}
        currentStep={grantStep}
        setCurrentStep={setGrantStep}
        selectedApi={selectedApiForGrant}
        setSelectedApi={(api) => setSelectedApiForGrant(api)}
        selectedOrganization={selectedOrganization}
        setSelectedOrganization={setSelectedOrganization}
        permissions={grantPermissions}
        setPermissions={setGrantPermissions}
        maxCallsPerDay={maxCallsPerDay}
        setMaxCallsPerDay={setMaxCallsPerDay}
        allowedIPs={allowedIPs}
        setAllowedIPs={setAllowedIPs}
        contactPerson={contactPerson}
        setContactPerson={setContactPerson}
        validUntil={validUntil}
        setValidUntil={setValidUntil}
      />



      {/* Modal Cấu hình */}
      {showConfigModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Cấu hình Nâng cao</h3>
                  <p className="text-sm text-slate-300 mt-0.5">{selectedService.code}</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                aria-label="Đóng cấu hình"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Retry Policy */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                    Retry Policy
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Max Retries</label>
                      <input
                        type="number"
                        title="Max Retries"
                        aria-label="Max Retries"
                        defaultValue={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Initial Delay (ms)</label>
                      <input
                        type="number"
                        title="Initial Delay (ms)"
                        aria-label="Initial Delay (ms)"
                        defaultValue={1000}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Max Delay (ms)</label>
                      <input
                        type="number"
                        title="Max Delay (ms)"
                        aria-label="Max Delay (ms)"
                        defaultValue={10000}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Timeout Settings */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Timeout Settings
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Connection Timeout (s)</label>
                      <input
                        type="number"
                        title="Connection Timeout (s)"
                        aria-label="Connection Timeout (s)"
                        defaultValue={30}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Read Timeout (s)</label>
                      <input
                        type="number"
                        title="Read Timeout (s)"
                        aria-label="Read Timeout (s)"
                        defaultValue={60}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate Limiting */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Rate Limiting
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Requests per Second</label>
                      <input
                        type="number"
                        title="Requests per Second"
                        aria-label="Requests per Second"
                        defaultValue={100}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Burst Size</label>
                      <input
                        type="number"
                        title="Burst Size"
                        aria-label="Burst Size"
                        defaultValue={200}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Circuit Breaker */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-orange-600" />
                    Circuit Breaker
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Failure Threshold</label>
                      <input
                        type="number"
                        title="Failure Threshold"
                        aria-label="Failure Threshold"
                        defaultValue={5}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Reset Timeout (s)</label>
                      <input
                        type="number"
                        title="Reset Timeout (s)"
                        aria-label="Reset Timeout (s)"
                        defaultValue={60}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Half-Open Requests</label>
                      <input
                        type="number"
                        title="Half-Open Requests"
                        aria-label="Half-Open Requests"
                        defaultValue={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Monitoring & Logging */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    Monitoring & Logging
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        title="Enable request logging"
                        aria-label="Enable request logging"
                        defaultChecked
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">Enable request logging</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        title="Enable performance metrics"
                        aria-label="Enable performance metrics"
                        defaultChecked
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">Enable performance metrics</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        title="Enable error alerting"
                        aria-label="Enable error alerting"
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">Enable error alerting</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Yêu cầu quyền Admin
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                  }}
                  className="px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Lưu cấu hình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-white">Xác nhận Xóa</h3>
                <p className="text-sm text-red-100 mt-0.5">Hành động không thể hoàn tác</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-700">
                  Bạn có chắc chắn muốn xóa dịch vụ sau không?
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-red-600 mb-0.5">Mã dịch vụ</p>
                      <p className="text-sm text-slate-900 font-mono">{selectedService.code}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 mb-0.5">Tên dịch vụ</p>
                      <p className="text-sm text-slate-900">{selectedService.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 mb-0.5">Endpoint</p>
                      <p className="text-sm text-slate-900 font-mono break-all">{selectedService.endpoint}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>Dữ liệu sẽ bị xóa vĩnh viễn</li>
                        <li>Các ứng dụng đang dùng sẽ bị ảnh hưởng</li>
                        <li>Lịch sử truy cập sẽ được lưu giữ</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trình duyệt */}
      {showSubmitApprovalModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Trình duyệt Dịch vụ</h3>
                  <p className="text-sm text-purple-100 mt-0.5">Gửi yêu cầu phê duyệt</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitApprovalModal(false)}
                aria-label="Đóng cửa sổ"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-5">
                {/* Thông tin dịch vụ */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-sm text-purple-900 mb-3 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Thông tin dịch vụ cần duyệt
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-purple-600 mb-1">Mã dịch vụ</p>
                      <p className="text-sm text-slate-900 font-mono">{selectedService.code}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 mb-1">Tên dịch vụ</p>
                      <p className="text-sm text-slate-900">{selectedService.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 mb-1">Loại</p>
                      <p className="text-sm text-slate-900">{selectedService.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 mb-1">Đơn vị</p>
                      <p className="text-sm text-slate-900">{selectedService.department}</p>
                    </div>
                  </div>
                </div>

                {/* Loại yêu cầu */}
                <div>
                  <label htmlFor="approval-request-type" className="block text-sm text-slate-700 mb-2">
                    Loại yêu cầu phê duyệt *
                  </label>
                  <select id="approval-request-type" title="Chọn loại yêu cầu phê duyệt" aria-label="Loại yêu cầu phê duyệt" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="publish">Xuất bản dịch vụ mới</option>
                    <option value="update">Cập nhật dịch vụ</option>
                    <option value="delete">Xóa dịch vụ</option>
                    <option value="config">Thay đổi cấu hình</option>
                  </select>
                </div>

                {/* Người duyệt */}
                <div>
                  <label htmlFor="approver-selection" className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Chọn người duyệt *
                  </label>
                  <select id="approver-selection" title="Chọn người phê duyệt" aria-label="Chọn người phê duyệt" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">-- Chọn người duyệt --</option>
                    <option value="user1">Nguyễn Văn A - Trưởng phòng Kỹ thuật</option>
                    <option value="user2">Trần Thị B - Phó Giám đốc CNTT</option>
                    <option value="user3">Lê Văn C - Trưởng phòng Nghiệp vụ</option>
                    <option value="user4">Phạm Thị D - Giám đốc Trung tâm</option>
                  </select>
                </div>



                {/* Phân loại công khai */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Phân loại công khai *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        title="Phân loại: Không công khai"
                        aria-label="Phân loại: Không công khai"
                        defaultChecked
                        className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-700">Không công khai</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        title="Phân loại: Công khai"
                        aria-label="Phân loại: Công khai"
                        className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-700">Công khai</span>
                    </label>
                  </div>
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Lưu ý: Chỉ dịch vụ được phê duyệt mới có thể chuyển sang công khai
                  </p>
                </div>

                {/* Lý do trình duyệt */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Lý do trình duyệt *
                  </label>
                  <textarea
                    id="submit-reason-textarea"
                    rows={4}
                    title="Nhập lý do trình duyệt"
                    aria-label="Lý do và mục đích cần phê duyệt dịch vụ này"
                    placeholder="Nhập lý do và mục đích cần phê duyệt dịch vụ này..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                {/* Tệp đính kèm */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Tệp đính kèm (nếu có)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <FolderOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Kéo thả tệp hoặc click để chọn</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, Word, Excel (Max 10MB)</p>
                  </div>
                </div>

                {/* Thông báo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>Người duyệt sẽ nhận được email thông báo</li>
                        <li>Thời gian xử lý tùy thuộc vào độ ưu tiên</li>
                        <li>Bạn có thể theo d��i trạng thái tại mục "Phê duyệt"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitApprovalModal(false)}
                className="px-4 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowSubmitApprovalModal(false);
                }}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                Gửi yêu cầu duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Màn hình Phê duyệt Lãnh đạo (UC2, UC3, UC4) */}
      <ApprovalReviewModal
        isOpen={showApprovalReviewModal}
        onClose={() => setShowApprovalReviewModal(false)}
      />

      {/* Confirm Công khai (UC5) */}
      {showPublishConfirm && serviceToPublish && (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Xác nhận Công khai Dịch vụ</h3>
                <p className="text-xs text-slate-500 mt-0.5">{serviceToPublish.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Dịch vụ sẽ được <strong className="text-green-600">công khai tự động</strong> lên Cổng dữ liệu dùng chung và nền tảng chia sẻ LGSP/NDXP. Hành động này sẽ thông báo tới các đơn vị liên quan.
            </p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowPublishConfirm(false); setServiceToPublish(null); }} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Huỷ</button>
              <button
                type="button"
                onClick={() => {
                  setServices(services.map(s => s.id === serviceToPublish.id ? { ...s, status: 'active' as any, visibility: 'public' as any } : s));
                  setShowPublishConfirm(false);
                  setServiceToPublish(null);
                }}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" /> Công khai ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
