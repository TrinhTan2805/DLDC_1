import { useState } from 'react';
import { Plus, Search, Server, Eye, Edit, Trash2, CheckCircle, XCircle, PlayCircle, PauseCircle, Activity, Download, Upload, X, Save, Send, AlertCircle, Copy, Check, FileDown, FileJson, FileSpreadsheet, FileCode } from 'lucide-react';
import { APIFormFields } from './APIFormFields';
import { APITestModal } from './APITestModal';

interface API {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'active' | 'passive';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  publishStatus?: 'published' | 'unpublished';
  endpoint: string;
  baseUrl?: string;
  httpMethod?: string;
  contentType?: string;
  authType?: string;
  apiKey?: string;
  headerName?: string;
  unitCode?: string;
  systemCode?: string;
  isActive?: boolean;
  source: string;
  target: string;
  requestCount: number;
  successRate: number;
  avgResponseTime: number;
  lastCall: string;
  createdDate?: string;
  lastModified?: string;
}

const mockAPIs: API[] = [
  {
    id: '1',
    code: 'API001',
    name: 'API tra cứu thông tin công dân',
    description: 'API tra cứu và lấy thông tin công dân từ cơ sở dữ liệu hộ tịch',
    type: 'active',
    method: 'GET',
    status: 'active',
    publishStatus: 'published',
    endpoint: '/api/v1/citizen/search',
    baseUrl: 'https://api-hotich.dldc.gov.vn',
    httpMethod: 'GET',
    contentType: 'JSON',
    authType: 'API Key',
    apiKey: 'key_hotich_12345',
    headerName: 'x-api-key',
    unitCode: 'BTP',
    systemCode: 'DLDC',
    isActive: true,
    source: 'CSDL Hộ tịch',
    target: 'Cổng dịch vụ công',
    requestCount: 15234,
    successRate: 99.2,
    avgResponseTime: 120,
    lastCall: '10/12/2024 14:30',
    createdDate: '01/01/2024',
    lastModified: '10/12/2024 14:30'
  },
  {
    id: '2',
    code: 'API002',
    name: 'API nhận dữ liệu đăng ký kinh doanh',
    description: 'API tiếp nhận dữ liệu đăng ký kinh doanh từ hệ thống bên ngoài',
    type: 'passive',
    method: 'POST',
    status: 'active',
    publishStatus: 'published',
    endpoint: '/api/v1/business/register',
    baseUrl: 'https://api-dkkd.dldc.gov.vn',
    httpMethod: 'POST',
    contentType: 'JSON',
    authType: 'Bearer Token',
    apiKey: 'bearer_token_xyz789',
    headerName: 'Authorization',
    unitCode: 'DKKD',
    systemCode: 'DLDC',
    isActive: true,
    source: 'Hệ thống ngoài',
    target: 'CSDL Đăng ký KD',
    requestCount: 8456,
    successRate: 98.5,
    avgResponseTime: 250,
    lastCall: '10/12/2024 14:25',
    createdDate: '15/02/2024',
    lastModified: '10/12/2024 14:25'
  },
  {
    id: '3',
    code: 'API003',
    name: 'API cập nhật thông tin văn bản pháp luật',
    description: 'API cập nhật và đồng bộ thông tin văn bản pháp luật',
    type: 'active',
    method: 'PUT',
    status: 'active',
    publishStatus: 'published',
    endpoint: '/api/v2/legal-docs/update',
    baseUrl: 'https://api-vbpl.dldc.gov.vn',
    httpMethod: 'PUT',
    contentType: 'JSON',
    authType: 'API Key',
    apiKey: 'key_vbpl_abc123',
    headerName: 'x-api-key',
    unitCode: 'VBPL',
    systemCode: 'DLDC',
    isActive: true,
    source: 'CSDL Văn bản PL',
    target: 'Cổng TTĐT',
    requestCount: 3421,
    successRate: 99.8,
    avgResponseTime: 95,
    lastCall: '10/12/2024 14:15',
    createdDate: '20/03/2024',
    lastModified: '10/12/2024 14:15'
  },
  {
    id: '4',
    code: 'API004',
    name: 'API đồng bộ dữ liệu công chứng',
    description: 'API đồng bộ dữ liệu từ hệ thống công chứng về kho DLDC',
    type: 'active',
    method: 'POST',
    status: 'error',
    publishStatus: 'published',
    endpoint: '/api/v1/notary/sync',
    baseUrl: 'https://api-congchung.dldc.gov.vn',
    httpMethod: 'POST',
    contentType: 'JSON',
    authType: 'Basic Auth',
    apiKey: 'basic_auth_credentials',
    headerName: 'Authorization',
    unitCode: 'CC',
    systemCode: 'DLDC',
    isActive: false,
    source: 'Hệ thống công chứng',
    target: 'Kho DLDC',
    requestCount: 1234,
    successRate: 85.3,
    avgResponseTime: 450,
    lastCall: '10/12/2024 13:50',
    createdDate: '10/04/2024',
    lastModified: '10/12/2024 13:50'
  },
  {
    id: '5',
    code: 'API005',
    name: 'API nhận yêu cầu trợ giúp pháp lý',
    description: 'API tiếp nhận yêu cầu trợ giúp pháp lý từ cổng dịch vụ công',
    type: 'passive',
    method: 'POST',
    status: 'inactive',
    publishStatus: 'published',
    endpoint: '/api/v1/legal-aid/request',
    baseUrl: 'https://api-tgpl.dldc.gov.vn',
    httpMethod: 'POST',
    contentType: 'JSON',
    authType: 'OAuth 2.0',
    apiKey: 'oauth_token_123',
    headerName: 'Authorization',
    unitCode: 'TGPL',
    systemCode: 'DLDC',
    isActive: false,
    source: 'Cổng DVC',
    target: 'CSDL TGPL',
    requestCount: 567,
    successRate: 92.1,
    avgResponseTime: 180,
    lastCall: '09/12/2024 16:20',
    createdDate: '05/05/2024',
    lastModified: '09/12/2024 16:20'
  },
  {
    id: '6',
    code: 'API006',
    name: 'API xuất dữ liệu báo cáo thống kê',
    description: 'API xuất dữ liệu báo cáo và thống kê từ kho DLDC',
    type: 'active',
    method: 'GET',
    status: 'active',
    publishStatus: 'published',
    endpoint: '/api/v1/reports/export',
    baseUrl: 'https://api-report.dldc.gov.vn',
    httpMethod: 'GET',
    contentType: 'JSON',
    authType: 'API Key',
    apiKey: 'key_report_999',
    headerName: 'x-api-key',
    unitCode: 'BC',
    systemCode: 'DLDC',
    isActive: true,
    source: 'Kho DLDC',
    target: 'Hệ thống báo cáo',
    requestCount: 2341,
    successRate: 99.5,
    avgResponseTime: 320,
    lastCall: '10/12/2024 14:00',
    createdDate: '12/06/2024',
    lastModified: '10/12/2024 14:00'
  }
];

export function APIManagementPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'passive'>('active');
  const [apis, setApis] = useState<API[]>(mockAPIs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showMonitorModal, setShowMonitorModal] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<API | null>(null);
  
  // Test API states
  const [testUrl, setTestUrl] = useState('');
  const [testMethod, setTestMethod] = useState('GET');
  const [testHeaders, setTestHeaders] = useState<{key: string, value: string}[]>([]);
  const [testParams, setTestParams] = useState<{key: string, value: string}[]>([]);
  const [testBody, setTestBody] = useState('');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    baseUrl: '',
    endpoint: '',
    httpMethod: 'GET',
    contentType: 'JSON',
    authType: 'API Key',
    apiKey: '',
    headerName: 'x-api-key',
    unitCode: '',
    systemCode: '',
    isActive: true,
    type: 'active'
  });
  
  const [headers, setHeaders] = useState<{key: string, value: string}[]>([]);
  const [queryParams, setQueryParams] = useState<{key: string, value: string}[]>([]);

  // Export dropdown state
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [exportDropdownId, setExportDropdownId] = useState<string | null>(null);

  // Filter APIs by active tab first
  const filteredAPIs = apis.filter(api => {
    const matchesTab = api.type === activeTab;
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || api.status === filterStatus;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-slate-100 text-slate-600 border-slate-200',
      error: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      active: 'Hoạt động',
      inactive: 'Tạm dừng',
      error: 'Lỗi'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'active' ? (
      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-full flex items-center gap-1 w-fit">
        <Upload className="w-3 h-3" />
        Chủ động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 border border-purple-200 rounded-full flex items-center gap-1 w-fit">
        <Download className="w-3 h-3" />
        Thụ động
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const styles = {
      GET: 'bg-green-100 text-green-700',
      POST: 'bg-blue-100 text-blue-700',
      PUT: 'bg-amber-100 text-amber-700',
      DELETE: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded ${styles[method as keyof typeof styles]}`}>
        {method}
      </span>
    );
  };

  const stats = {
    total: apis.length,
    active: apis.filter(a => a.type === 'active').length,
    passive: apis.filter(a => a.type === 'passive').length,
    running: apis.filter(a => a.status === 'active').length,
    error: apis.filter(a => a.status === 'error').length
  };

  // Export single API
  const handleExportSingleAPI = (api: API, format: 'json' | 'csv' | 'xml' | 'excel') => {
    const filename = `api_${api.code}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      const jsonStr = JSON.stringify(api, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['Trường', 'Giá trị'];
      const csvRows = [
        headers.join(','),
        `"Mã API","${api.code}"`,
        `"Tên API","${api.name}"`,
        `"Mô tả","${api.description || 'N/A'}"`,
        `"Loại","${api.type === 'active' ? 'Chủ động' : 'Thụ động'}"`,
        `"Phương thức","${api.method}"`,
        `"Endpoint","${api.endpoint}"`,
        `"Base URL","${api.baseUrl || 'N/A'}"`,
        `"Nguồn","${api.source}"`,
        `"Đích","${api.target}"`,
        `"Số lượt gọi","${api.requestCount}"`,
        `"Tỷ lệ thành công","${api.successRate}%"`,
        `"Thời gian phản hồi TB","${api.avgResponseTime}ms"`,
        `"Trạng thái","${api.status === 'active' ? 'Hoạt động' : api.status === 'inactive' ? 'Tạm dừng' : 'Lỗi'}"`,
        `"Tình trạng công bố","${api.publishStatus === 'published' ? 'Đã công bố' : 'Chưa công bố'}"`,
        `"Ngày tạo","${api.createdDate || 'N/A'}"`,
        `"Cập nhật lần cuối","${api.lastModified || 'N/A'}"`
      ];
      const csvStr = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'xml') {
      let xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n<api>\n';
      xmlStr += `  <code>${api.code}</code>\n`;
      xmlStr += `  <name>${api.name}</name>\n`;
      xmlStr += `  <description>${api.description || 'N/A'}</description>\n`;
      xmlStr += `  <type>${api.type}</type>\n`;
      xmlStr += `  <method>${api.method}</method>\n`;
      xmlStr += `  <endpoint>${api.endpoint}</endpoint>\n`;
      xmlStr += `  <baseUrl>${api.baseUrl || 'N/A'}</baseUrl>\n`;
      xmlStr += `  <source>${api.source}</source>\n`;
      xmlStr += `  <target>${api.target}</target>\n`;
      xmlStr += `  <requestCount>${api.requestCount}</requestCount>\n`;
      xmlStr += `  <successRate>${api.successRate}</successRate>\n`;
      xmlStr += `  <avgResponseTime>${api.avgResponseTime}</avgResponseTime>\n`;
      xmlStr += `  <status>${api.status}</status>\n`;
      xmlStr += `  <publishStatus>${api.publishStatus || 'unpublished'}</publishStatus>\n`;
      xmlStr += `  <createdDate>${api.createdDate || 'N/A'}</createdDate>\n`;
      xmlStr += `  <lastModified>${api.lastModified || 'N/A'}</lastModified>\n`;
      xmlStr += '</api>';
      const blob = new Blob([xmlStr], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xml`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      const headers = ['Trường', 'Giá trị'];
      const csvRows = [
        headers.join('\t'),
        `Mã API\t${api.code}`,
        `Tên API\t${api.name}`,
        `Mô tả\t${api.description || 'N/A'}`,
        `Loại\t${api.type === 'active' ? 'Chủ động' : 'Thụ động'}`,
        `Phương thức\t${api.method}`,
        `Endpoint\t${api.endpoint}`,
        `Base URL\t${api.baseUrl || 'N/A'}`,
        `Nguồn\t${api.source}`,
        `Đích\t${api.target}`,
        `Số lượt gọi\t${api.requestCount}`,
        `Tỷ lệ thành công\t${api.successRate}%`,
        `Thời gian phản hồi TB\t${api.avgResponseTime}ms`,
        `Trạng thái\t${api.status === 'active' ? 'Hoạt động' : api.status === 'inactive' ? 'Tạm dừng' : 'Lỗi'}`,
        `Tình trạng công bố\t${api.publishStatus === 'published' ? 'Đã công bố' : 'Chưa công bố'}`,
        `Ngày tạo\t${api.createdDate || 'N/A'}`,
        `Cập nhật lần cuối\t${api.lastModified || 'N/A'}`
      ];
      const csvStr = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvStr], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xls`;
      link.click();
      URL.revokeObjectURL(url);
    }
    setExportDropdownId(null);
  };

  // Export function
  const handleExport = (format: 'json' | 'csv' | 'xml' | 'excel') => {
    const dataToExport = filteredAPIs.length > 0 ? filteredAPIs : apis;
    const filename = `api_list_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['STT', 'Mã API', 'Tên API', 'Loại', 'Phương thức', 'Endpoint', 'Nguồn', 'Đích', 'Số lượt gọi', 'Tỷ lệ thành công', 'Trạng thái'];
      const csvRows = [
        headers.join(','),
        ...dataToExport.map((api, index) => [
          index + 1,
          api.code,
          `"${api.name}"`,
          api.type === 'active' ? 'Chủ động' : 'Thụ động',
          api.method,
          api.endpoint,
          `"${api.source}"`,
          `"${api.target}"`,
          api.requestCount,
          api.successRate,
          api.status === 'active' ? 'Hoạt động' : api.status === 'inactive' ? 'Tạm dừng' : 'Lỗi'
        ].join(','))
      ];
      const csvStr = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'xml') {
      let xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n<apis>\n';
      dataToExport.forEach(api => {
        xmlStr += '  <api>\n';
        xmlStr += `    <code>${api.code}</code>\n`;
        xmlStr += `    <name>${api.name}</name>\n`;
        xmlStr += `    <type>${api.type}</type>\n`;
        xmlStr += `    <method>${api.method}</method>\n`;
        xmlStr += `    <endpoint>${api.endpoint}</endpoint>\n`;
        xmlStr += `    <source>${api.source}</source>\n`;
        xmlStr += `    <target>${api.target}</target>\n`;
        xmlStr += `    <requestCount>${api.requestCount}</requestCount>\n`;
        xmlStr += `    <successRate>${api.successRate}</successRate>\n`;
        xmlStr += `    <status>${api.status}</status>\n`;
        xmlStr += '  </api>\n';
      });
      xmlStr += '</apis>';
      const blob = new Blob([xmlStr], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xml`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // For Excel, we'll use CSV format with Excel-friendly encoding
      const headers = ['STT', 'Mã API', 'Tên API', 'Loại', 'Phương thức', 'Endpoint', 'Nguồn', 'Đích', 'Số lượt gọi', 'Tỷ lệ thành công', 'Trạng thái'];
      const csvRows = [
        headers.join('\t'),
        ...dataToExport.map((api, index) => [
          index + 1,
          api.code,
          api.name,
          api.type === 'active' ? 'Chủ động' : 'Thụ động',
          api.method,
          api.endpoint,
          api.source,
          api.target,
          api.requestCount,
          api.successRate,
          api.status === 'active' ? 'Hoạt động' : api.status === 'inactive' ? 'Tạm dừng' : 'Lỗi'
        ].join('\t'))
      ];
      const csvStr = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvStr], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xls`;
      link.click();
      URL.revokeObjectURL(url);
    }
    setShowExportDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 text-sm transition-colors relative ${
                activeTab === 'active'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                API chủ động
              </div>
              {activeTab === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('passive')}
              className={`px-6 py-3 text-sm transition-colors relative ${
                activeTab === 'passive'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Cung cấp dữ liệu thụ động hoặc theo yêu cầu
              </div>
              {activeTab === 'passive' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Tổng số API</div>
                  <div className="text-slate-900 mt-1">{stats.total}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">API chủ động</div>
                  <div className="text-slate-900 mt-1">{stats.active}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">API thụ động</div>
                  <div className="text-slate-900 mt-1">{stats.passive}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Đang hoạt động</div>
                  <div className="text-slate-900 mt-1">{stats.running}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Lỗi</div>
                  <div className="text-slate-900 mt-1">{stats.error}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="api-search-input"
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã API, endpoint..."
                  aria-label="Tìm kiếm API"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                id="api-type-filter"
                aria-label="Lọc theo loại API"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả loại API</option>
                <option value="active">API chủ động</option>
                <option value="passive">API thụ động</option>
              </select>
              <select
                id="api-status-filter"
                aria-label="Lọc theo trạng thái"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="error">Lỗi</option>
              </select>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
              >
                <FileDown className="w-4 h-4" />
                Xuất dữ liệu
              </button>
              <button 
                onClick={() => {
                  setFormData({
                    name: '',
                    description: '',
                    baseUrl: '',
                    endpoint: '',
                    httpMethod: 'GET',
                    contentType: 'JSON',
                    authType: 'API Key',
                    apiKey: '',
                    headerName: 'x-api-key',
                    unitCode: '',
                    systemCode: '',
                    isActive: true,
                    type: activeTab
                  });
                  setHeaders([]);
                  setQueryParams([]);
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Thêm API mới
              </button>
            </div>
          </div>

          {/* API List */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã API</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên API</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phương thức</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn → Đích</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số lượt gọi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tỷ lệ thành công</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAPIs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-slate-500 text-sm">
                        Không tìm thấy API phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredAPIs.map((api, index) => (
                      <tr key={api.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">
                            {api.code}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-900">{api.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            <code>{api.endpoint}</code>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getTypeBadge(api.type)}</td>
                        <td className="px-4 py-3">{getMethodBadge(api.method)}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <div className="flex items-center gap-1 text-xs">
                            <span>{api.source}</span>
                            <span className="text-slate-400">→</span>
                            <span>{api.target}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {api.requestCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`${api.successRate >= 95 ? 'text-green-700' : api.successRate >= 85 ? 'text-amber-700' : 'text-red-700'}`}>
                            {api.successRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(api.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" 
                              title="Xem chi tiết"
                              aria-label={`Xem chi tiết API ${api.name}`}
                              onClick={() => {
                                setSelectedAPI(api);
                                setShowViewModal(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" 
                              title="Chỉnh sửa"
                              aria-label={`Chỉnh sửa API ${api.name}`}
                              onClick={() => {
                                setSelectedAPI(api);
                                setFormData(api);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded" 
                              title="Giám sát"
                              aria-label={`Giám sát API ${api.name}`}
                              onClick={() => {
                                setSelectedAPI(api);
                                setShowMonitorModal(true);
                              }}
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                            
                            {/* Export dropdown for single API */}
                            <div className="relative">
                              <button 
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" 
                                title="Xuất dữ liệu"
                                onClick={() => setExportDropdownId(exportDropdownId === api.id ? null : api.id)}
                              >
                                <FileDown className="w-4 h-4" />
                              </button>
                              
                              {exportDropdownId === api.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setExportDropdownId(null)}
                                  />
                                  <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleExportSingleAPI(api, 'json')}
                                        className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <FileJson className="w-3.5 h-3.5 text-blue-600" />
                                        JSON
                                      </button>
                                      <button
                                        onClick={() => handleExportSingleAPI(api, 'csv')}
                                        className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <FileCode className="w-3.5 h-3.5 text-green-600" />
                                        CSV
                                      </button>
                                      <button
                                        onClick={() => handleExportSingleAPI(api, 'xml')}
                                        className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <FileCode className="w-3.5 h-3.5 text-orange-600" />
                                        XML
                                      </button>
                                      <button
                                        onClick={() => handleExportSingleAPI(api, 'excel')}
                                        className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                                        Excel
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {api.publishStatus === 'published' ? (
                              <button 
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                                title="Hủy công bố"
                                onClick={() => {
                                  setSelectedAPI(api);
                                  setShowUnpublishModal(true);
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" 
                                title="Công bố"
                                aria-label={`Công bố API ${api.name}`}
                                onClick={() => {
                                  setSelectedAPI(api);
                                  setShowPublishModal(true);
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                              title="Xóa"
                              aria-label={`Xóa API ${api.name}`}
                              onClick={() => {
                                setSelectedAPI(api);
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

          {/* Add API Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-slate-900">Thêm API mới</h2>
                  <button 
                    onClick={() => setShowAddModal(false)} 
                    className="text-slate-400 hover:text-slate-600"
                    title="Đóng"
                    aria-label="Đóng bảng thêm API"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <APIFormFields
                    formData={formData}
                    setFormData={setFormData}
                    headers={headers}
                    setHeaders={setHeaders}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                  />
                </div>

                <div className="flex items-center justify-between p-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setTestUrl(`${formData.baseUrl || ''}${formData.endpoint || ''}`);
                      setTestMethod(formData.httpMethod || 'GET');
                      setTestHeaders(headers.length > 0 ? headers : (formData.headerName && formData.apiKey ? [{key: formData.headerName, value: formData.apiKey}] : []));
                      setTestParams(queryParams);
                      setTestBody('');
                      setTestResponse(null);
                      setShowAddModal(false);
                      setShowTestModal(true);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Server className="w-4 h-4" />
                    Test API
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        // Handle save logic here
                        setShowAddModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit API Modal */}
          {showEditModal && selectedAPI && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-slate-900">Chỉnh sửa API</h2>
                  <button 
                    onClick={() => setShowEditModal(false)} 
                    className="text-slate-400 hover:text-slate-600"
                    title="Đóng bản chỉnh sửa"
                    aria-label="Đóng bản chỉnh sửa"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <APIFormFields
                    formData={formData}
                    setFormData={setFormData}
                    headers={headers}
                    setHeaders={setHeaders}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                  />

                  {/* Thông tin tnh trạng công bố */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm text-slate-900 mb-4">Tình trạng công bố</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Trạng thái hiện tại</label>
                          <div className="text-sm">
                            {selectedAPI.publishStatus === 'published' ? (
                              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
                                Công bố
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                                Hủy công bố
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {selectedAPI.publishStatus === 'published' ? (
                            <button
                              onClick={() => {
                                setShowEditModal(false);
                                setShowUnpublishModal(true);
                              }}
                              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Hủy công bố
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setShowEditModal(false);
                                setShowPublishModal(true);
                              }}
                              className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Công bố
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setTestUrl(`${formData.baseUrl || ''}${formData.endpoint || ''}`);
                      setTestMethod(formData.httpMethod || 'GET');
                      setTestHeaders(headers.length > 0 ? headers : (formData.headerName && formData.apiKey ? [{key: formData.headerName, value: formData.apiKey}] : []));
                      setTestParams(queryParams);
                      setTestBody('');
                      setTestResponse(null);
                      setShowEditModal(false);
                      setShowTestModal(true);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Server className="w-4 h-4" />
                    Test API
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        // Handle update logic here
                        setShowEditModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Cập nhật
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View API Details Modal */}
          {showViewModal && selectedAPI && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-slate-900">Chi tiết API</h2>
                  <button 
                    onClick={() => setShowViewModal(false)} 
                    className="text-slate-400 hover:text-slate-600"
                    title="Đóng chi tiết"
                    aria-label="Đóng bảng chi tiết API"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Loại API */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Loại API</label>
                    <div>{getTypeBadge(selectedAPI.type)}</div>
                  </div>

                  {/* Thông tin chung */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Tên API</label>
                    <div className="text-sm text-slate-900">{selectedAPI.name || 'N/A'}</div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Mô tả</label>
                    <div className="text-sm text-slate-900">{selectedAPI.description || 'N/A'}</div>
                  </div>

                  {/* Cấu hình Endpoint */}
                  <div className="space-y-4">
                    <h3 className="text-sm text-slate-900">Cấu hình Endpoint</h3>
                    
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Base URL</label>
                      <div className="text-sm text-slate-900 break-all">{selectedAPI.baseUrl || 'N/A'}</div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Endpoint</label>
                      <div className="text-sm text-slate-900 break-all">{selectedAPI.endpoint || 'N/A'}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">HTTP Method</label>
                        <div className="text-sm text-slate-900">{selectedAPI.httpMethod || 'GET'}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Content Type</label>
                        <div className="text-sm text-slate-900">{selectedAPI.contentType || 'JSON'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Xác thực */}
                  <div className="space-y-4">
                    <h3 className="text-sm text-slate-900">Xác thực</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Loại xác thực</label>
                        <div className="text-sm text-slate-900">{selectedAPI.authType || 'API Key'}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Header Name</label>
                        <div className="text-sm text-slate-900">{selectedAPI.headerName || 'x-api-key'}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">API Key</label>
                      <div className="text-sm text-slate-900">{selectedAPI.apiKey ? '••••••••••••' : 'Chưa cấu hình'}</div>
                    </div>
                  </div>

                  {/* Cấu hình đơn vị LSGP */}
                  <div className="space-y-4">
                    <h3 className="text-sm text-slate-900">Cấu hình đơn vị LSGP (Liên sở giữa phòng)</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Mã đơn vị</label>
                        <div className="text-sm text-slate-900">{selectedAPI.unitCode || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Mã hệ thống</label>
                        <div className="text-sm text-slate-900">{selectedAPI.systemCode || 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Trạng thái kết nối</label>
                      <div className="text-sm">
                        {selectedAPI.isActive ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                            Đã kích hoạt
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                            Chưa kích hoạt
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thống kê hoạt động */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="text-sm text-slate-900">Thống kê hoạt động</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Số lượt gọi</label>
                        <div className="text-sm text-slate-900">{selectedAPI.requestCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Tỷ lệ thành công</label>
                        <div className="text-sm text-slate-900">{selectedAPI.successRate}%</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Thời gian phản hồi TB</label>
                        <div className="text-sm text-slate-900">{selectedAPI.avgResponseTime}ms</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Lần gọi cuối</label>
                      <div className="text-sm text-slate-900">{selectedAPI.lastCall || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Thông tin hệ thống */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="text-sm text-slate-900">Thông tin hệ thống</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Ngày tạo</label>
                        <div className="text-sm text-slate-900">{selectedAPI.createdDate || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Cập nhật lần cuối</label>
                        <div className="text-sm text-slate-900">{selectedAPI.lastModified || 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Tình trạng công bố</label>
                      <div className="text-sm">
                        {selectedAPI.publishStatus === 'published' ? (
                          <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
                            Công bố
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                            Hủy công bố
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && selectedAPI && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-slate-900">Xác nhận xóa</h2>
                  <button 
                    onClick={() => setShowDeleteModal(false)} 
                    className="text-slate-400 hover:text-slate-600"
                    title="Hủy"
                    aria-label="Đóng bảng xóa hồ sơ"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-700">
                    Bạn có chắc chắn muốn xóa API <strong>{selectedAPI.name}</strong> không? Hành động này không thể hoàn tác.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      // Handle delete logic here
                      setShowDeleteModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Publish Modal */}
          {showPublishModal && selectedAPI && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-slate-900">Xác nhận công bố</h2>
                  <button 
                    onClick={() => setShowPublishModal(false)} 
                    className="text-slate-400 hover:text-slate-600"
                    title="Đóng cửa sổ"
                    aria-label="Đóng xác nhận công bố"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-700 mb-4">
                    Bạn có chắc chắn muốn công bố API <strong>{selectedAPI.name}</strong> không?
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Mã API:</span>
                      <span className="ml-2 text-slate-900">{selectedAPI.code}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Endpoint:</span>
                      <code className="ml-2 text-slate-900 text-xs">{selectedAPI.endpoint}</code>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (selectedAPI) {
                        setApis(apis.map(api => 
                          api.id === selectedAPI.id 
                            ? { ...api, publishStatus: 'published' as const }
                            : api
                        ));
                        setShowPublishModal(false);
                        setSelectedAPI(null);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Công bố
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unpublish Modal */}
          {showUnpublishModal && selectedAPI && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-slate-900">Xác nhận hủy công bố</h2>
                  <button 
                    onClick={() => setShowUnpublishModal(false)} 
                    className="text-slate-400 hover:text-slate-600"
                    title="Đóng cửa sổ"
                    aria-label="Đóng xác nhận hủy công bố"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-700 mb-4">
                    Bạn có chắc chắn muốn hủy công bố API <strong>{selectedAPI.name}</strong> không?
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Mã API:</span>
                      <span className="ml-2 text-slate-900">{selectedAPI.code}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Endpoint:</span>
                      <code className="ml-2 text-slate-900 text-xs">{selectedAPI.endpoint}</code>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowUnpublishModal(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (selectedAPI) {
                        setApis(apis.map(api => 
                          api.id === selectedAPI.id 
                            ? { ...api, publishStatus: 'unpublished' as const }
                            : api
                        ));
                        setShowUnpublishModal(false);
                        setSelectedAPI(null);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Hủy công bố
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test API Modal */}
      <APITestModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        testUrl={testUrl}
        setTestUrl={setTestUrl}
        testMethod={testMethod}
        setTestMethod={setTestMethod}
        testHeaders={testHeaders}
        setTestHeaders={setTestHeaders}
        testParams={testParams}
        setTestParams={setTestParams}
        testBody={testBody}
        setTestBody={setTestBody}
        testResponse={testResponse}
        setTestResponse={setTestResponse}
        isTestLoading={isTestLoading}
        setIsTestLoading={setIsTestLoading}
      />

      {/* Monitor Modal */}
      {showMonitorModal && selectedAPI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-slate-900">Giám sát API</h2>
                <p className="text-sm text-slate-600 mt-1">{selectedAPI.name}</p>
              </div>
              <button 
                onClick={() => setShowMonitorModal(false)} 
                className="text-slate-400 hover:text-slate-600"
                title="Đóng cửa sổ"
                aria-label="Đóng bảng giám sát"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-xs text-blue-700 mb-1">Tổng số request</div>
                  <div className="text-2xl font-semibold text-blue-600">{selectedAPI.requestCount.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs text-green-700 mb-1">Tỷ lệ thành công</div>
                  <div className="text-2xl font-semibold text-green-600">{selectedAPI.successRate}%</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-xs text-purple-700 mb-1">Thời gian phản hồi TB</div>
                  <div className="text-2xl font-semibold text-purple-600">{selectedAPI.avgResponseTime}ms</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-700 mb-1">Lần gọi cuối</div>
                  <div className="text-sm font-medium text-slate-900 mt-2">{selectedAPI.lastCall}</div>
                </div>
              </div>

              {/* API Information */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Thông tin API</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Mã API:</span>
                    <code className="ml-2 px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">{selectedAPI.code}</code>
                  </div>
                  <div>
                    <span className="text-slate-600">Phương thức:</span>
                    <span className="ml-2 text-slate-900">{selectedAPI.method}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Loại:</span>
                    <span className="ml-2 text-slate-900">{selectedAPI.type === 'active' ? 'API chủ động' : 'API bị động'}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Trạng thái:</span>
                    <span className="ml-2 text-slate-900">
                      {selectedAPI.status === 'active' ? 'Hoạt động' : selectedAPI.status === 'inactive' ? 'Tạm dừng' : 'Lỗi'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-600">Endpoint:</span>
                    <code className="ml-2 text-slate-900 text-xs">{selectedAPI.baseUrl}{selectedAPI.endpoint}</code>
                  </div>
                </div>
              </div>

              {/* Activity Chart Placeholder */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Hoạt động trong 24h qua</h3>
                <div className="h-48 bg-slate-50 rounded flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Biểu đồ hoạt động</p>
                  </div>
                </div>
              </div>

              {/* Recent Logs */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Logs gần đây</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">10/12/2024 14:30:15</span>
                    <span className="text-slate-900">GET request thành công - Response time: 115ms</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">10/12/2024 14:28:42</span>
                    <span className="text-slate-900">GET request thành công - Response time: 123ms</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">10/12/2024 14:25:10</span>
                    <span className="text-slate-900">GET request thành công - Response time: 108ms</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs p-2 bg-red-50 rounded">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-slate-600">10/12/2024 14:20:33</span>
                    <span className="text-slate-900">GET request thất bại - Error: Timeout</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">10/12/2024 14:18:05</span>
                    <span className="text-slate-900">GET request thành công - Response time: 130ms</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Chỉ số hiệu suất</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Requests thành công</span>
                      <span className="text-green-600 font-medium">{Math.round(selectedAPI.requestCount * selectedAPI.successRate / 100)}</span>
                    </div>
                    <div 
                      className="w-full bg-slate-200 rounded-full h-2" 
                      role="progressbar" 
                      aria-valuenow={selectedAPI?.successRate ?? 0} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                      aria-label="Requests thành công"
                    >
                      <div 
                        style={{ '--progress-width': `${selectedAPI?.successRate ?? 0}%` } as React.CSSProperties}
                        className="bg-green-500 h-2 rounded-full w-[var(--progress-width)]"
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Requests thất bại</span>
                      <span className="text-red-600 font-medium">{selectedAPI.requestCount - Math.round(selectedAPI.requestCount * selectedAPI.successRate / 100)}</span>
                    </div>
                    <div 
                      className="w-full bg-slate-200 rounded-full h-2"
                      role="progressbar"
                      aria-valuenow={selectedAPI ? (100 - selectedAPI.successRate) : 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Requests thất bại"
                    >
                      <div 
                        style={{ '--progress-width': `${selectedAPI ? (100 - selectedAPI.successRate) : 0}%` } as React.CSSProperties}
                        className="bg-red-500 h-2 rounded-full w-[var(--progress-width)]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowMonitorModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}