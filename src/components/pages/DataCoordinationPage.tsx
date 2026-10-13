import { toast } from 'sonner';
import React, { useState } from 'react';
import { 
  Plus, Search, Server, CheckCircle, Clock, XCircle, Eye, Edit, X, Check,
  Activity, TrendingUp, TrendingDown, Zap, FileText, RefreshCw, Download,
  PlayCircle, BookOpen, BarChart3, Settings, Database, ChevronRight, ChevronDown,
  Globe, ExternalLink, HardDrive, AlertCircle, Copy
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AddServiceModal } from '../modals/AddServiceModal';
import { ServiceDetailModal } from '../modals/ServiceDetailModal';
import { DataRequestModal } from '../modals/DataRequestModal';
import { APIAccessControlModal } from '../modals/APIAccessControlModal';
import { ReportModal } from '../modals/ReportModal';
import { EditServiceModal } from '../modals/EditServiceModal';
import { APIDocumentationModal } from '../modals/APIDocumentationModal';
import { APIStatisticsModal } from '../modals/APIStatisticsModal';
import { APIConfigModal } from '../modals/APIConfigModal';
import { ProcessRequestModal } from '../modals/ProcessRequestModal';
import { RequestDetailModal } from '../modals/RequestDetailModal';
import { NotificationDetailModal } from '../modals/NotificationDetailModal';

type ServiceStatus = 'active' | 'pending' | 'rejected' | 'inactive';
type RequestStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface DataService {
  id: string;
  code: string;
  name: string;
  department: string;
  database: string;
  description: string;
  apiEndpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: ServiceStatus;
  accessLevel: 'public' | 'internal' | 'restricted';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  requestCount: number;
  successRate: number;
  avgResponseTime: number;
  lastUsed?: string;
}

interface DataRequest {
  id: string;
  requestCode: string;
  serviceName: string;
  requester: string;
  requesterDepartment: string;
  requestDate: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  purpose: string;
  estimatedRows?: number;
  completedDate?: string;
  processedBy?: string;
  apiEndpoint?: string;
}

interface APILog {
  id: string;
  timestamp: string;
  service: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requester: string;
  ipAddress: string;
  userAgent: string;
}

const initialServices: DataService[] = [
  {
    id: '1',
    code: 'SVC_A_001',
    name: 'CSDL A',
    department: 'Đơn vị A',
    database: 'DB_A',
    description: 'Cung cấp dữ liệu từ CSDL A',
    apiEndpoint: '/api/v1/service-a/records',
    method: 'GET',
    status: 'active',
    accessLevel: 'internal',
    createdBy: 'Người dùng A',
    createdDate: '2024-01-15',
    approvedBy: 'Quản lý A',
    approvedDate: '2024-01-20',
    requestCount: 15420,
    successRate: 99.8,
    avgResponseTime: 145,
    lastUsed: '2024-12-09 14:30:00'
  },
  {
    id: '2',
    code: 'SVC_B_001',
    name: 'Hệ thống B',
    department: 'Đơn vị B',
    database: 'DB_B',
    description: 'Cung cấp dữ liệu từ Hệ thống B',
    apiEndpoint: '/api/v1/service-b/cases',
    method: 'GET',
    status: 'active',
    accessLevel: 'restricted',
    createdBy: 'Người dùng B',
    createdDate: '2024-02-10',
    approvedBy: 'Quản lý B',
    approvedDate: '2024-02-15',
    requestCount: 8965,
    successRate: 98.5,
    avgResponseTime: 230,
    lastUsed: '2024-12-09 13:45:00'
  },
  {
    id: '3',
    code: 'SVC_C_001',
    name: 'CSDL C',
    department: 'Đơn vị C',
    database: 'DB_C',
    description: 'Cung cấp dữ liệu từ CSDL C',
    apiEndpoint: '/api/v1/service-c/guarantees',
    method: 'GET',
    status: 'active',
    accessLevel: 'public',
    createdBy: 'Người dùng C',
    createdDate: '2024-03-05',
    approvedBy: 'Quản lý C',
    approvedDate: '2024-03-10',
    requestCount: 42350,
    successRate: 99.2,
    avgResponseTime: 180,
    lastUsed: '2024-12-09 15:10:00'
  },
  {
    id: '4',
    code: 'SVC_PHAPLUAT_001',
    name: 'CSDL Quốc gia về pháp luật',
    department: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính',
    database: 'DB_PHAPLUAT',
    description: 'Cung cấp văn bản pháp luật, văn bản quy phạm pháp luật',
    apiEndpoint: '/api/v1/legal-documents/laws',
    method: 'GET',
    status: 'active',
    accessLevel: 'public',
    createdBy: 'Hoàng Văn E',
    createdDate: '2024-01-20',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-25',
    requestCount: 65820,
    successRate: 99.9,
    avgResponseTime: 95,
    lastUsed: '2024-12-09 15:25:00'
  },
  {
    id: '5',
    code: 'SVC_DAUGIA_001',
    name: 'CSDL Quản lý đấu giá tài sản',
    department: 'Cục Bổ trợ tư pháp',
    database: 'DB_DAUGIA',
    description: 'Cung cấp thông tin về tài sản đấu giá, kết quả đấu giá',
    apiEndpoint: '/api/v1/auction/assets',
    method: 'GET',
    status: 'pending',
    accessLevel: 'public',
    createdBy: 'Vũ Thị F',
    createdDate: '2024-11-20',
    requestCount: 0,
    successRate: 0,
    avgResponseTime: 0
  }
];

const initialRequests: DataRequest[] = [
  {
    id: '1',
    requestCode: 'REQ-2024-001234',
    serviceName: 'DB_HOTICH - tbl_khai_sinh',
    requester: 'Nguyễn Văn X',
    requesterDepartment: 'Bộ Công an',
    requestDate: '2024-12-09 10:30:00',
    status: 'processing',
    priority: 'high',
    purpose: 'Tra cứu thông tin công dân phục vụ cấp CCCD',
    estimatedRows: 1500,
    apiEndpoint: '/api/v1/data-export/civil-registry'
  },
  {
    id: '2',
    requestCode: 'REQ-2024-001235',
    serviceName: 'DB_THADS - tbl_ban_an',
    requester: 'Trần Thị Y',
    requesterDepartment: 'Tòa án nhân dân TP.HCM',
    requestDate: '2024-12-09 09:15:00',
    status: 'completed',
    priority: 'medium',
    purpose: 'Kiểm tra thông tin người bị thi hành án',
    estimatedRows: 250,
    completedDate: '2024-12-09 11:45:00',
    processedBy: 'Hệ thống tự động',
    apiEndpoint: '/api/v1/data-export/judgment-enforcement'
  },
  {
    id: '3',
    requestCode: 'REQ-2024-001236',
    serviceName: 'DB_BPBD - tbl_tai_san_the_chap',
    requester: 'Lê Văn Z',
    requesterDepartment: 'Ngân hàng TMCP Á Châu',
    requestDate: '2024-12-09 14:20:00',
    status: 'pending',
    priority: 'urgent',
    purpose: 'Kiểm tra tài sản thế chấp trước khi cho vay',
    estimatedRows: 50,
    apiEndpoint: '/api/v1/data-export/secured-transactions'
  }
];

const departmentServices = [
  {
    department: 'Dịch vụ cung cấp dữ liệu mở theo Quyết định số 1459/QĐ-BTP ngày 15',
    services: [
      { code: 'QD1459-001', name: 'Cung cấp dữ liệu mở về Danh sách tổ chức thực hiện trợ giúp pháp lý' },
      { code: 'QD1459-002', name: 'Cung cấp dữ liệu mở về Danh sách người thực hiện trợ giúp pháp lý' },
      { code: 'QD1459-003', name: 'Cung cấp dữ liệu mở về Danh sách tổ chức hành nghề công chứng' },
      { code: 'QD1459-004', name: 'Cung cấp dữ liệu mở về Danh sách công chứng viên' },
      { code: 'QD1459-005', name: 'Cung cấp dữ liệu mở về Danh sách tổ chức giám định tư pháp' },
      { code: 'QD1459-006', name: 'Cung cấp dữ liệu mở về Danh sách cá nhân giám định tư pháp' },
      { code: 'QD1459-007', name: 'Cung cấp dữ liệu mở về Danh sách luật sư Việt Nam' },
      { code: 'QD1459-008', name: 'Cung cấp dữ liệu mở về Danh sách tổ chức hành nghề luật sư Việt Nam' },
      { code: 'QD1459-009', name: 'Cung cấp dữ liệu mở về Danh sách luật sư nước ngoài' },
      { code: 'QD1459-010', name: 'Cung cấp dữ liệu mở về Danh sách tổ chức hành nghề luật sư nước ngoài' },
      { code: 'QD1459-011', name: 'Cung cấp dữ liệu mở về Danh sách Bào chào hành nghiệu luật trong vụ kiện' },
      { code: 'QD1459-012', name: 'Cung cấp dữ liệu mở về Danh sách Xây dựng văn bản quy phạm' },
      { code: 'QD1459-013', name: 'Cung cấp dữ liệu mở về Danh sách Kiểm tra văn bản quy phạm' },
      { code: 'QD1459-014', name: 'Cung cấp dữ liệu mở về Danh sách Rà soát văn bản quy phạm' },
      { code: 'QD1459-015', name: 'Cung cấp dữ liệu mở về Danh sách Tổ chức và người làm các pháp chế' },
      { code: 'QD1459-016', name: 'Cung cấp dữ liệu mở về Danh sách Phổ biến, giáo dục pháp luật' },
      { code: 'QD1459-017', name: 'Cung cấp dữ liệu mở về Danh sách Hòa giải ở cơ sở' },
      { code: 'QD1459-018', name: 'Cung cấp dữ liệu mở về Danh sách Chuẩn tiếp cận pháp luật' },
      { code: 'QD1459-019', name: 'Cung cấp dữ liệu mở về Danh sách Hộ tịch' },
      { code: 'QD1459-020', name: 'Cung cấp dữ liệu mở về Danh sách Chứng thực' },
      { code: 'QD1459-021', name: 'Cung cấp dữ liệu mở về Danh sách Lý lịch tư pháp' },
      { code: 'QD1459-022', name: 'Cung cấp dữ liệu mở về Danh sách Nuôi con nuôi' },
      { code: 'QD1459-023', name: 'Cung cấp dữ liệu mở về Danh sách Trợ giúp pháp lý' },
      { code: 'QD1459-024', name: 'Cung cấp dữ liệu mở về Danh sách Đăng ký giao dịch bảo đảm' },
      { code: 'QD1459-025', name: 'Cung cấp dữ liệu mở về Danh sách Luật sư' },
      { code: 'QD1459-026', name: 'Cung cấp dữ liệu mở về Danh sách Công chứng cán cứng cấp' },
      { code: 'QD1459-027', name: 'Cung cấp dữ liệu mở về Danh sách Giám định tư pháp cán cứng cấp' },
      { code: 'QD1459-028', name: 'Cung cấp dữ liệu mở về Danh sách Đăng ký tài sản' },
      { code: 'QD1459-029', name: 'Cung cấp dữ liệu mở về Danh sách Đấu giá tài sản' },
      { code: 'QD1459-030', name: 'Cung cấp dữ liệu mở về Danh sách Trong tài thương mại' },
      { code: 'QD1459-031', name: 'Cung cấp dữ liệu mở về Danh sách Hội thẩm thương mại' },
      { code: 'QD1459-032', name: 'Cung cấp dữ liệu mở về Danh sách Quản lý doanh lý tài sản' },
      { code: 'QD1459-033', name: 'Cung cấp dữ liệu mở về Danh sách Tương trợ tư pháp' },
      { code: 'QD1459-034', name: 'Cung cấp dữ liệu mở về Danh sách Hợp tác quốc tế' }
    ]
  },
  {
    department: 'Cung cấp dữ liệu chủ đề liên chủ',
    services: [
      { code: 'LIENCHU-001', name: 'Cung cấp dữ liệu về Dữ liệu chủ cán cứng cấp' }
    ]
  },
  {
    department: 'Đơn vị A',
    services: [
      { code: 'SVC_A_001', name: 'CSDL A' }
    ]
  },
  {
    department: 'Đơn vị B',
    services: [
      { code: 'SVC_B_001', name: 'Hệ thống B' }
    ]
  },
  {
    department: 'Đơn vị C',
    services: [
      { code: 'SVC_C_001', name: 'CSDL C' }
    ]
  },
  {
    department: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính',
    services: [
      { code: 'SVC_PHAPLUAT_001', name: 'CSDL Quốc gia về pháp luật' },
      { code: 'SVC_TTPL_001', name: 'CSDL Tương trợ tư pháp về dân sự' },
      { code: 'SVC_TGPL_001', name: 'Hệ thống thông tin trợ giúp pháp lý' },
      { code: 'SVC_PBGDPL_001', name: 'CSDL Phổ biến, giáo dục pháp luật và hoà giải cơ sở' }
    ]
  },
  {
    department: 'Cục Bổ trợ tư pháp',
    services: [
      { code: 'SVC_DAUGIA_001', name: 'CSDL Quản lý đấu giá tài sản' }
    ]
  },
  {
    department: 'Vụ Hợp tác quốc tế',
    services: [
      { code: 'SVC_HTQT_001', name: 'CSDL Hợp tác quốc tế' }
    ]
  }
];

export function DataCoordinationPage() {
  const [currentTab, setCurrentTab] = useState<'setup' | 'api-management' | 'passive' | 'monitoring' | 'catalog'>('api-management');
  const [services, setServices] = useState<DataService[]>(initialServices);
  const [requests, setRequests] = useState<DataRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<DataService | null>(null);
  const [showAccessControlModal, setShowAccessControlModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedServiceForAccess, setSelectedServiceForAccess] = useState<DataService | null>(null);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [selectedServiceForEdit, setSelectedServiceForEdit] = useState<DataService | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['Cục Hành chính tư pháp']);
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all');
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [selectedServiceForDocs, setSelectedServiceForDocs] = useState<DataService | null>(null);
  const [selectedServiceForStats, setSelectedServiceForStats] = useState<DataService | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedServiceForConfig, setSelectedServiceForConfig] = useState<DataService | null>(null);
  const [showProcessRequestModal, setShowProcessRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [showRequestDetailModal, setShowRequestDetailModal] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<DataRequest | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedLogForNotification, setSelectedLogForNotification] = useState<any>(null);
  const [expandedErrorLog, setExpandedErrorLog] = useState<number | null>(null);
  const [showAPIDocModal, setShowAPIDocModal] = useState(false);
  const [selectedServiceForDoc, setSelectedServiceForDoc] = useState<any>(null);

  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.status === 'active').length,
    pendingServices: services.filter(s => s.status === 'pending').length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    processingRequests: requests.filter(r => r.status === 'processing').length,
    totalApiCalls: services.reduce((sum, s) => sum + s.requestCount, 0),
    avgSuccessRate: services.length > 0 
      ? services.reduce((sum, s) => sum + s.successRate, 0) / services.length 
      : 0,
    avgResponseTime: services.length > 0
      ? services.reduce((sum, s) => sum + s.avgResponseTime, 0) / services.length
      : 0
  };

  const toggleDepartment = (dept: string) => {
    if (expandedDepts.includes(dept)) {
      setExpandedDepts(expandedDepts.filter(d => d !== dept));
    } else {
      setExpandedDepts([...expandedDepts, dept]);
    }
  };

  // Chart data
  const apiCallsData = [
    { time: '00:00', calls: 1200 },
    { time: '02:00', calls: 800 },
    { time: '04:00', calls: 600 },
    { time: '06:00', calls: 1500 },
    { time: '08:00', calls: 3200 },
    { time: '10:00', calls: 4500 },
    { time: '12:00', calls: 3800 },
    { time: '14:00', calls: 5200 },
    { time: '16:00', calls: 4100 },
    { time: '18:00', calls: 2800 },
    { time: '20:00', calls: 2100 },
    { time: '22:00', calls: 1600 },
  ];

  const responseTimeData = [
    { time: '00:00', avgTime: 120, maxTime: 180 },
    { time: '02:00', avgTime: 95, maxTime: 150 },
    { time: '04:00', avgTime: 85, maxTime: 130 },
    { time: '06:00', avgTime: 110, maxTime: 200 },
    { time: '08:00', avgTime: 150, maxTime: 320 },
    { time: '10:00', avgTime: 180, maxTime: 450 },
    { time: '12:00', avgTime: 165, maxTime: 380 },
    { time: '14:00', avgTime: 190, maxTime: 520 },
    { time: '16:00', avgTime: 175, maxTime: 410 },
    { time: '18:00', avgTime: 140, maxTime: 280 },
    { time: '20:00', avgTime: 125, maxTime: 210 },
    { time: '22:00', avgTime: 105, maxTime: 160 },
  ];

  const statusCodeData = [
    { name: '2xx Success', value: 98234, color: '#10b981' },
    { name: '4xx Client Error', value: 856, color: '#f59e0b' },
    { name: '5xx Server Error', value: 124, color: '#ef4444' },
  ];

  const topServicesData = [
    { name: 'CSDL Pháp luật', calls: 65820 },
    { name: 'CSDL Biện pháp bảo đảm', calls: 42350 },
    { name: 'CSDL Đăng ký kinh doanh', calls: 28640 },
    { name: 'CSDL Hộ tịch', calls: 15420 },
    { name: 'CSDL Thi hành án', calls: 8965 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Điều phối dữ liệu" icon={Server} />
      
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 grid grid-cols-5 gap-1">
        <button
          onClick={() => setCurrentTab('setup')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'setup'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Thiết lập dịch vụ
        </button>
        <button
          onClick={() => setCurrentTab('api-management')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'api-management'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Quản lý API
        </button>
        <button
          onClick={() => setCurrentTab('passive')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
            currentTab === 'passive'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Cung cấp thụ động
          {stats.pendingRequests > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {stats.pendingRequests}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab('monitoring')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'monitoring'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Giám sát
        </button>
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'catalog'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Danh mục dịch vụ
        </button>
      </div>

      {/* Setup Tab */}
      {currentTab === 'setup' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Đăng ký dịch vụ mới
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`bg-white border rounded-lg p-4 text-left transition-all hover:shadow-md ${
                statusFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng dịch vụ</span>
                <Server className={`w-5 h-5 ${statusFilter === 'all' ? 'text-blue-600' : 'text-blue-600'}`} />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalServices}</div>
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`bg-white border rounded-lg p-4 text-left transition-all hover:shadow-md ${
                statusFilter === 'active' ? 'border-green-500 ring-2 ring-green-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đang hoạt động</span>
                <CheckCircle className={`w-5 h-5 ${statusFilter === 'active' ? 'text-green-600' : 'text-green-600'}`} />
              </div>
              <div className="text-2xl text-slate-900">{stats.activeServices}</div>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`bg-white border rounded-lg p-4 text-left transition-all hover:shadow-md ${
                statusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Chờ phê duyệt</span>
                <Clock className={`w-5 h-5 ${statusFilter === 'pending' ? 'text-amber-600' : 'text-amber-600'}`} />
              </div>
              <div className="text-2xl text-slate-900">{stats.pendingServices}</div>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-3">
            {services
              .filter(s => {
                // Filter by status
                const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
                // Filter by search term
                const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     s.code.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesStatus && matchesSearch;
              })
              .map((service) => (
                <div key={service.id} className="bg-white border border-slate-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-slate-900">{service.name}</h3>
                        {service.status === 'active' && (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Hoạt động
                          </span>
                        )}
                        {service.status === 'pending' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Chờ duyệt
                          </span>
                        )}
                        {service.status === 'rejected' && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Từ chối
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{service.description}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Mã dịch vụ:</span>
                          <span className="ml-2 text-slate-900 font-mono">{service.code}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Đơn vị:</span>
                          <span className="ml-2 text-slate-900">{service.department}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Phương thức:</span>
                          <span className="ml-2 text-slate-900">
                            <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">
                              {service.method}
                            </code>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Truy cập:</span>
                          <span className="ml-2 text-slate-900 capitalize">{service.accessLevel === 'public' ? 'Công khai' : service.accessLevel === 'internal' ? 'Nội bộ' : 'Hạn chế'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    {service.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Phê duyệt
                        </button>
                        <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Từ chối
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedService(service)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedServiceForEdit(service);
                        setShowEditServiceModal(true);
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* API Management Tab */}
      {currentTab === 'api-management' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng API calls</span>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalApiCalls.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% so với tháng trước</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tỷ lệ thành công</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.avgSuccessRate.toFixed(1)}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0.2% so với tháng trước</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Thời gian phản hồi TB</span>
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl text-slate-900">{Math.round(stats.avgResponseTime)}ms</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingDown className="w-3 h-3" />
                <span>-15ms so với tháng trước</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">API đang hoạt động</span>
                <Server className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.activeServices}</div>
              <div className="text-xs text-slate-500 mt-1">
                Trên tổng số {stats.totalServices} dịch vụ
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-slate-900">Danh sách API Endpoints</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Endpoint</th>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Phương thức</th>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Dịch vụ</th>
                    <th className="px-5 py-3 text-right text-sm text-slate-600">Lượt gọi</th>
                    <th className="px-5 py-3 text-right text-sm text-slate-600">Tỷ lệ TC</th>
                    <th className="px-5 py-3 text-right text-sm text-slate-600">Avg Time</th>
                    <th className="px-5 py-3 text-center text-sm text-slate-600">Trạng thái</th>
                    <th className="px-5 py-3 text-right text-sm text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {services.filter(s => s.status === 'active').map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <code className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded">
                          {service.apiEndpoint}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          service.method === 'GET' ? 'bg-green-100 text-green-700' :
                          service.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                          service.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {service.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-900">{service.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-900 text-right">
                        {service.requestCount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-right">
                        <span className={`${
                          service.successRate >= 99 ? 'text-green-600' :
                          service.successRate >= 95 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {service.successRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-900 text-right">
                        {service.avgResponseTime}ms
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Online
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedServiceForDocs(service);
                              setShowDocumentationModal(true);
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedServiceForStats(service);
                              setShowStatisticsModal(true);
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedServiceForConfig(service);
                              setShowConfigModal(true);
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Settings className="w-4 h-4" />
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

      {/* Passive Data Provision Tab */}
      {currentTab === 'passive' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tạo yêu cầu mới
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng yêu cầu</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalRequests}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Chờ xử lý</span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.pendingRequests}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đang xử lý</span>
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.processingRequests}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Hoàn thành</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-slate-900">
                {requests.filter(r => r.status === 'completed').length}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{request.requestCode}</h3>
                      {request.status === 'pending' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Chờ xử lý
                        </span>
                      )}
                      {request.status === 'processing' && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          Đang xử lý
                        </span>
                      )}
                      {request.status === 'completed' && (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Hoàn thành
                        </span>
                      )}
                      {request.priority === 'urgent' && (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Khẩn cấp
                        </span>
                      )}
                      {request.priority === 'high' && (
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Cao
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                      <div>
                        <span className="text-slate-500">Dịch vụ:</span>
                        <span className="ml-2 text-slate-900">{request.serviceName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Người yêu cầu:</span>
                        <span className="ml-2 text-slate-900">{request.requester}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Đơn vị:</span>
                        <span className="ml-2 text-slate-900">{request.requesterDepartment}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Thời gian:</span>
                        <span className="ml-2 text-slate-900">{request.requestDate}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                      <div className="text-slate-500 mb-1">Mục đích:</div>
                      <div className="text-slate-900">{request.purpose}</div>
                    </div>
                    {request.apiEndpoint && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mt-3">
                        <div className="text-blue-700 mb-1 flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          <span>API Endpoint:</span>
                        </div>
                        <code className="text-blue-900 bg-white px-2 py-1 rounded border border-blue-300">
                          {request.apiEndpoint}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowProcessRequestModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Bắt ầu xử lý
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Từ chối
                      </button>
                    </>
                  )}
                  {request.status === 'completed' && (
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Tải xuống
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedRequestForDetail(request);
                      setShowRequestDetailModal(true);
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {currentTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">API Calls - 24h qua</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height={256}>
                  <LineChart data={apiCallsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Lượt gọi API"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">Response Time - 24h qua</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height={256}>
                  <AreaChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="avgTime" 
                      stroke="#3b82f6" 
                      fill="#93c5fd" 
                      name="Avg Time (ms)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="maxTime" 
                      stroke="#f59e0b" 
                      fill="#fcd34d" 
                      name="Max Time (ms)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">Phân bố Status Code</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height={256}>
                  <PieChart>
                    <Pie
                      data={statusCodeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusCodeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {statusCodeData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-slate-900">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">Top Dịch vụ theo lượt gọi</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height={256}>
                  <BarChart data={topServicesData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis dataKey="name" type="category" width={150} stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Bar dataKey="calls" fill="#8b5cf6" name="Lượt gọi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-slate-900">Activity Logs (Real-time)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Timestamp</th>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Dịch vụ</th>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Endpoint</th>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Method</th>
                    <th className="px-5 py-3 text-center text-sm text-slate-600">Status</th>
                    <th className="px-5 py-3 text-right text-sm text-slate-600">Response Time</th>
                    <th className="px-5 py-3 text-left text-sm text-slate-600">Requester</th>
                    <th className="px-5 py-3 text-center text-sm text-slate-600">Thông báo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { time: '15:25:34', service: 'CSDL Hộ tịch', endpoint: '/api/v1/civil-registry/records', method: 'GET', status: 200, responseTime: 145, requester: 'Bộ Công an', notificationSent: false },
                    { time: '15:25:12', service: 'CSDL Biện pháp bảo đảm', endpoint: '/api/v1/secured-transactions/guarantees', method: 'GET', status: 200, responseTime: 180, requester: 'ACB Bank', notificationSent: false },
                    { time: '15:24:58', service: 'CSDL Pháp luật', endpoint: '/api/v1/legal-documents/laws', method: 'GET', status: 200, responseTime: 95, requester: 'Bộ Tài chính', notificationSent: false },
                    { time: '15:24:45', service: 'CSDL THADS', endpoint: '/api/v1/judgment-enforcement/cases', method: 'GET', status: 500, responseTime: 5230, requester: 'TAND TP.HCM', notificationSent: true, errorDetail: 'Database connection timeout - Connection timed out after 5000ms', notification: { id: '1', sentTo: 'Trần Văn A', sentToEmail: 'tran.a@moj.gov.vn', sentToRole: 'Quản trị hệ thống CSDL THADS', sentAt: '2024-12-09 15:24:50', viewed: true, viewedAt: '2024-12-09 15:26:15', notificationType: 'email' as const, subject: 'Cảnh báo: Lỗi hệ thống - CSDL THADS', message: 'Hệ thống CSDL THADS gặp lỗi kết nối database. Endpoint /api/v1/judgment-enforcement/cases trả về status code 500 với thời gian phản hồi 5230ms. Vui lòng kiểm tra và xử lý ngay.' } },
                    { time: '15:24:30', service: 'CSDL Hộ tịch', endpoint: '/api/v1/civil-registry/records', method: 'POST', status: 201, responseTime: 320, requester: 'Sở Tư pháp HN', notificationSent: false },
                  ].map((log, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-sm text-slate-600">{log.time}</td>
                        <td className="px-5 py-3 text-sm text-slate-900">{log.service}</td>
                        <td className="px-5 py-3">
                          <code className="text-xs text-blue-700">{log.endpoint}</code>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            log.method === 'GET' ? 'bg-green-100 text-green-700' :
                            log.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              log.status >= 200 && log.status < 300 ? 'bg-green-100 text-green-700' :
                              log.status >= 400 && log.status < 500 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {log.status}
                            </span>
                            {log.status >= 400 && log.errorDetail && (
                              <button
                                onClick={() => setExpandedErrorLog(expandedErrorLog === idx ? null : idx)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                title="Xem chi tiết lỗi"
                              >
                                {expandedErrorLog === idx ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-900 text-right">
                          <span className={log.responseTime > 1000 ? 'text-red-600' : ''}>
                            {log.responseTime}ms
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-900">{log.requester}</td>
                        <td className="px-5 py-3 text-center">
                          {log.notificationSent ? (
                            <button
                              onClick={() => {
                                setSelectedNotification(log.notification);
                                setSelectedLogForNotification({
                                  service: log.service,
                                  endpoint: log.endpoint,
                                  status: log.status,
                                  timestamp: log.time
                                });
                                setShowNotificationModal(true);
                              }}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors flex items-center gap-1 mx-auto"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Đã gửi
                            </button>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">
                              Chưa gửi
                            </span>
                          )}
                        </td>
                      </tr>
                      {expandedErrorLog === idx && log.errorDetail && (
                        <tr className="bg-red-50">
                          <td colSpan={8} className="px-5 py-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm text-red-900 mb-1">Chi tiết lỗi:</div>
                                <div className="text-sm text-red-800 bg-white border border-red-200 rounded px-3 py-2 font-mono">
                                  {log.errorDetail}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {currentTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4">Danh mục dịch vụ cung cấp dữ liệu theo đơn vị</h3>
            <p className="text-sm text-slate-600 mb-6">
              Các dịch vụ cung cấp dữ liệu dùng chung từ các đơn vị trong nội bộ
            </p>

            <div className="space-y-2">
              {departmentServices.map((dept, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg">
                  <button
                    onClick={() => toggleDepartment(dept.department)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-amber-600" />
                      <span className="text-slate-900">{dept.department}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {dept.services.length} dịch vụ
                      </span>
                    </div>
                    {expandedDepts.includes(dept.department) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  
                  {expandedDepts.includes(dept.department) && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      <div className="space-y-2">
                        {dept.services.map((service, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                  <Server className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-sm text-slate-900">{service.name}</div>
                                  <div className="text-xs text-slate-500 font-mono">{service.code}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(service.code);
                                  }}
                                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                  title="Copy mã dịch vụ"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedServiceForDoc(service);
                                    setShowAPIDocModal(true);
                                  }}
                                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                  title="Xem tài liệu API"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4">Dịch vụ cung cấp dữ liệu mở</h3>
            <p className="text-sm text-slate-600 mb-4">
              Theo Quyết định số 1459/QĐ ngày 15 tháng 5 năm 2025
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm text-blue-900 mb-2">
                    Dịch vụ cung cấp dữ liệu mở (chủ động)
                  </div>
                  <div className="text-xs text-blue-700">
                    Portal: <a href="#" className="underline">https://opendata.moj.gov.vn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4">Cung cấp dữ liệu chủ</h3>
            <p className="text-sm text-slate-600 mb-4">
              Dịch vụ cung cấp dữ liệu chủ (Master Data) cho các hệ thống nội ngành và liên ngành
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Dữ liệu chủ - Công dân', endpoint: '/api/v1/master-data/md_person' },
                { name: 'Dữ liệu chủ - Tổ chức', endpoint: '/api/v1/master-data/md_organization' },
                { name: 'Dữ liệu chủ - Địa điểm', endpoint: '/api/v1/master-data/md_location' },
                { name: 'Dữ liệu chủ - Tài sản', endpoint: '/api/v1/master-data/md_asset' }
              ].map((md, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-teal-600" />
                    <div className="text-sm text-slate-900">{md.name}</div>
                  </div>
                  <code className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {md.endpoint}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={() => setShowAddServiceModal(false)}
        onSave={(newService) => {
          setServices([...services, newService]);
          setShowAddServiceModal(false);
        }}
      />
      <ServiceDetailModal
        isOpen={selectedService !== null}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onApprove={(id) => {
          setServices(services.map(s => 
            s.id === id 
              ? {...s, status: 'active' as ServiceStatus, approvedBy: 'Trần Thị B', approvedDate: new Date().toISOString().split('T')[0]}
              : s
          ));
        }}
        onReject={(id) => {
          setServices(services.map(s => 
            s.id === id 
              ? {...s, status: 'rejected' as ServiceStatus}
              : s
          ));
        }}
        onSuspend={(id) => {
          setServices(services.map(s => 
            s.id === id 
              ? {...s, status: 'inactive' as ServiceStatus}
              : s
          ));
        }}
        onPublish={(id) => {
          toast.success(`Dịch vụ ${id} đã được công khai`);
        }}
      />
      <DataRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={(newRequest) => {
          setRequests([newRequest, ...requests]);
          setShowRequestModal(false);
        }}
        services={services}
      />
      <APIAccessControlModal
        isOpen={showAccessControlModal}
        service={selectedServiceForAccess}
        onClose={() => {
          setShowAccessControlModal(false);
          setSelectedServiceForAccess(null);
        }}
        onSave={() => {
          if (selectedServiceForAccess) {
            toast.success(`Quyền truy cập cho dịch vụ ${selectedServiceForAccess.name} đã được cập nhật`);
          }
          setShowAccessControlModal(false);
          setSelectedServiceForAccess(null);
        }}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        services={services}
      />
      <EditServiceModal
        isOpen={showEditServiceModal}
        service={selectedServiceForEdit}
        onClose={() => {
          setShowEditServiceModal(false);
          setSelectedServiceForEdit(null);
        }}
        onSave={(updatedService) => {
          if (selectedServiceForEdit) {
            setServices(services.map(s => 
              s.id === selectedServiceForEdit.id 
                ? {...s, ...updatedService}
                : s
            ));
          }
          setShowEditServiceModal(false);
          setSelectedServiceForEdit(null);
        }}
      />
      <APIDocumentationModal
        isOpen={showDocumentationModal}
        onClose={() => setShowDocumentationModal(false)}
        service={selectedServiceForDocs}
      />
      <APIStatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        service={selectedServiceForStats}
      />
      <APIConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        service={selectedServiceForConfig}
        onSave={() => {
          toast.success('Cấu hình API đã được lưu thành công');
        }}
      />
      <ProcessRequestModal
        isOpen={showProcessRequestModal}
        request={selectedRequest}
        onClose={() => {
          setShowProcessRequestModal(false);
          setSelectedRequest(null);
        }}
        onProcess={() => {
          if (selectedRequest) {
            setRequests(requests.map(r => 
              r.id === selectedRequest.id 
                ? {...r, status: 'processing' as RequestStatus}
                : r
            ));
          }
          setShowProcessRequestModal(false);
          setSelectedRequest(null);
        }}
      />
      <RequestDetailModal
        isOpen={showRequestDetailModal}
        request={selectedRequestForDetail}
        onClose={() => setSelectedRequestForDetail(null)}
      />
      <NotificationDetailModal
        isOpen={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false);
          setSelectedNotification(null);
          setSelectedLogForNotification(null);
        }}
        notification={selectedNotification}
        logInfo={selectedLogForNotification}
      />
      <APIDocumentationModal
        isOpen={showAPIDocModal}
        service={selectedServiceForDoc}
        onClose={() => {
          setShowAPIDocModal(false);
          setSelectedServiceForDoc(null);
        }}
      />
    </div>
  );
}