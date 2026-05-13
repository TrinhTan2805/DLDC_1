import * as React from 'react';
import { useState } from 'react';
import { Settings, Plus, Search, Edit, Trash2, Save, X, Calendar, Database, FileText, Clock, Play, Loader2, CheckCircle, History as HistoryIcon, Eye, Download, Send, AlertCircle, Info, Filter, Layers, Server, Package, RefreshCw, BarChart3, FileCheck, XCircle } from 'lucide-react';
import { CreateLGSPReconciliationModal } from '../modals/CreateLGSPReconciliationModal';
import { StatusTag } from '../common/StatusTag';

// Interface cho bản ghi đối soát dữ liệu
interface ReconciliationRecord {
  id: string;
  datasetCode: string;
  datasetName: string;
  providerSystem: string;
  providerSystemCode: string;
  dataType: string;
  recordCount: number;
  receiveDate: string;
  status: 'matched' | 'mismatched' | 'pending' | 'error';
  statusText: string;
  statusColor: string;
  errorCount?: number;
  matchRate?: number;
  lastReconcileDate?: string;
  fromDate?: string;
  toDate?: string;
  sentCount?: number;
  receivedCount?: number;
  isReportSent?: boolean;
}

// Interface cho lỗi chi tiết
interface ReconciliationError {
  id: string;
  recordId: string;
  fieldName: string;
  errorType: string;
  sourceValue: string;
  targetValue: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  severityColor: string;
}

// Interface cho gói tin đối soát
interface ReconciliationPackage {
  id: string;
  name: string;
  targetSystem: string;
  targetSystemName: string;
  dataType: string;
  status: 'draft' | 'sent' | 'confirmed' | 'failed';
  statusText: string;
  statusColor: string;
  createdDate: string;
  sentDate?: string;
  recordCount: number;
  dataSize: string;
  apiEndpoint: string;
  hasFeedback: boolean;
  feedbackDate?: string;
}

// Interface cho cấu hình API
interface APIConfig {
  id: string;
  targetSystem: string;
  targetSystemName: string;
  endpoint: string;
  method: string;
  authType: string;
  status: 'active' | 'inactive';
  lastUsed?: string;
  totalSent: number;
}

// Interface cho phản hồi từ hệ thống đích
interface SystemFeedback {
  id: string;
  packageId: string;
  packageName: string;
  targetSystem: string;
  receivedDate: string;
  recordsReceived: number;
  recordsExpected: number;
  dataSize: string;
  status: 'complete' | 'partial' | 'error';
  statusText: string;
  statusColor: string;
  fields: FeedbackField[];
  notes?: string;
}

// Interface cho thông tin trường dữ liệu trong phản hồi
interface FeedbackField {
  fieldName: string;
  fieldType: string;
  recordCount: number;
  completeness: number;
}

// Interface cho log
interface LogEntry {
  id: string;
  packageId: string;
  packageName: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  details: string;
  status: 'success' | 'failed';
}

// Interface cho lịch sử
interface ReconciliationHistory {
  id: string;
  packageId: string;
  packageName: string;
  targetSystem: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed';
  recordCount: number;
  dataSize: string;
  details: string;
}

// Mock data - Bản ghi đối soát
const mockReconciliationRecords: ReconciliationRecord[] = [
  {
    id: 'REC001',
    datasetCode: 'DM-GIOITINH-2024-12',
    datasetName: 'Danh mục giới tính',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    providerSystemCode: 'SYS_HOTICH',
    dataType: 'Danh mục',
    recordCount: 3,
    receiveDate: '2024-12-20 10:15:00',
    status: 'matched',
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-12-20 10:30:00',
    fromDate: '2024-12-01',
    toDate: '2024-12-20',
    sentCount: 3,
    receivedCount: 3,
    isReportSent: false
  },
  {
    id: 'REC002',
    datasetCode: 'CSDL-DN-2024-Q4',
    datasetName: 'CSDL Doanh nghiệp - Quý 4/2024',
    providerSystem: 'Hệ thống Đăng ký kinh doanh',
    providerSystemCode: 'SYS_DKKD',
    dataType: 'Doanh nghiệp',
    recordCount: 125000,
    receiveDate: '2024-12-19 15:30:00',
    status: 'mismatched',
    statusText: 'Không khớp',
    statusColor: 'bg-orange-100 text-orange-700 border-orange-200',
    errorCount: 2450,
    matchRate: 98.04,
    lastReconcileDate: '2024-12-19 16:00:00',
    fromDate: '2024-10-01',
    toDate: '2024-12-19',
    sentCount: 125000,
    receivedCount: 122550,
    isReportSent: true
  },
  {
    id: 'REC003',
    datasetCode: 'CSDL-CC-2024-11',
    datasetName: 'CSDL Công chứng - Tháng 11/2024',
    providerSystem: 'Hệ thống Công chứng',
    providerSystemCode: 'SYS_CONGCHUNG',
    dataType: 'Công chứng',
    recordCount: 45000,
    receiveDate: '2024-12-18 09:20:00',
    status: 'pending',
    statusText: 'Đang xử lý',
    statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
    lastReconcileDate: '2024-12-18 09:20:00'
  },
  {
    id: 'REC004',
    datasetCode: 'CSDL-TGPL-2024-12',
    datasetName: 'CSDL TGPL - Tháng 12/2024',
    providerSystem: 'Hệ thống Trợ giúp pháp lý',
    providerSystemCode: 'SYS_TGPL',
    dataType: 'Trợ giúp pháp lý',
    recordCount: 32500,
    receiveDate: '2024-12-21 14:45:00',
    status: 'error',
    statusText: 'Lỗi nghiêm trọng',
    statusColor: 'bg-red-100 text-red-700 border-red-200',
    errorCount: 8920,
    matchRate: 72.55,
    lastReconcileDate: '2024-12-21 15:00:00'
  },
  {
    id: 'REC005',
    datasetCode: 'CSDL-HC-2024-12',
    datasetName: 'CSDL Hành chính - Tháng 12/2024',
    providerSystem: 'Hệ thống Hành chính',
    providerSystemCode: 'SYS_HANHCHINH',
    dataType: 'Hành chính',
    recordCount: 230000,
    receiveDate: '2024-12-20 11:30:00',
    status: 'matched',
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 99.98,
    lastReconcileDate: '2024-12-20 12:00:00'
  },
  {
    id: 'REC006',
    datasetCode: 'CSDL-TT-2024-12',
    datasetName: 'CSDL Thông tin - Tháng 12/2024',
    providerSystem: 'Hệ thống Thông tin',
    providerSystemCode: 'SYS_THONGTIN',
    dataType: 'Thông tin',
    recordCount: 156000,
    receiveDate: '2024-12-17 08:15:00',
    status: 'mismatched',
    statusText: 'Không khớp',
    statusColor: 'bg-orange-100 text-orange-700 border-orange-200',
    errorCount: 520,
    matchRate: 99.67,
    lastReconcileDate: '2024-12-17 08:45:00'
  }
];

// Mock data - Lỗi chi tiết
const mockReconciliationErrors: ReconciliationError[] = [
  {
    id: 'ERR001',
    recordId: 'DN-125478',
    fieldName: 'Mã số thuế',
    errorType: 'Không khớp giá trị',
    sourceValue: '0123456789',
    targetValue: '0123456788',
    description: 'Giá trị mã số thuế trong hệ thống nguồn và hệ thống đích không khớp',
    severity: 'high',
    severityColor: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'ERR002',
    recordId: 'DN-125479',
    fieldName: 'Địa chỉ',
    errorType: 'Thiếu dữ liệu',
    sourceValue: '',
    targetValue: '123 Nguyễn Văn A, Quận 1, TP.HCM',
    description: 'Trường địa chỉ không có giá trị trong hệ thống nguồn',
    severity: 'medium',
    severityColor: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'ERR003',
    recordId: 'DN-125480',
    fieldName: 'Ngày cấp',
    errorType: 'Định dạng không hợp lệ',
    sourceValue: '20/12/2024',
    targetValue: '2024-12-20',
    description: 'Định dạng ngày tháng không đúng chuẩn ISO 8601',
    severity: 'low',
    severityColor: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'ERR004',
    recordId: 'DN-125481',
    fieldName: 'Vốn điều lệ',
    errorType: 'Không khớp giá trị',
    sourceValue: '1000000000',
    targetValue: '1500000000',
    description: 'Giá trị vốn điều lệ có sự chênh lệch giữa hai hệ thống',
    severity: 'high',
    severityColor: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'ERR005',
    recordId: 'DN-125482',
    fieldName: 'Email',
    errorType: 'Thiếu dữ liệu',
    sourceValue: '',
    targetValue: 'contact@company.vn',
    description: 'Trường email không có giá trị trong hệ thống nguồn',
    severity: 'medium',
    severityColor: 'bg-orange-100 text-orange-700 border-orange-200'
  }
];

// Mock data - Gói tin đối soát
const mockPackages: ReconciliationPackage[] = [
  {
    id: 'PKG001',
    name: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
    targetSystem: 'SYS_HOTICH',
    targetSystemName: 'Hệ thống Hộ tịch điện tử',
    dataType: 'Hộ tịch',
    status: 'confirmed',
    statusText: 'Đã xác nhận',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    createdDate: '2024-12-20 08:30:00',
    sentDate: '2024-12-20 09:00:00',
    recordCount: 850000,
    dataSize: '2.3 GB',
    apiEndpoint: 'https://hotich.gov.vn/api/reconciliation',
    hasFeedback: true,
    feedbackDate: '2024-12-20 10:15:00'
  },
  {
    id: 'PKG002',
    name: 'Gói tin đối soát CSDL Doanh nghiệp - Quý 4/2024',
    targetSystem: 'SYS_DKKD',
    targetSystemName: 'Hệ thống Đăng ký kinh doanh',
    dataType: 'Doanh nghiệp',
    status: 'sent',
    statusText: 'Đã gửi',
    statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
    createdDate: '2024-12-19 14:00:00',
    sentDate: '2024-12-19 15:30:00',
    recordCount: 125000,
    dataSize: '1.8 GB',
    apiEndpoint: 'https://dkkd.gov.vn/api/reconciliation',
    hasFeedback: false
  },
  {
    id: 'PKG003',
    name: 'Gói tin đối soát CSDL Công chứng - Tháng 11/2024',
    targetSystem: 'SYS_CONGCHUNG',
    targetSystemName: 'Hệ thống Công chứng',
    dataType: 'Công chứng',
    status: 'draft',
    statusText: 'Nháp',
    statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
    createdDate: '2024-12-21 10:00:00',
    recordCount: 45000,
    dataSize: '890 MB',
    apiEndpoint: 'https://congchung.gov.vn/api/reconciliation',
    hasFeedback: false
  }
];

// Mock data - Cấu hình API
const mockAPIConfigs: APIConfig[] = [
  {
    id: 'API001',
    targetSystem: 'SYS_HOTICH',
    targetSystemName: 'Hệ thống Hộ tịch điện tử',
    endpoint: 'https://hotich.gov.vn/api/reconciliation',
    method: 'POST',
    authType: 'API Key',
    status: 'active',
    lastUsed: '2024-12-20 09:00:00',
    totalSent: 24
  },
  {
    id: 'API002',
    targetSystem: 'SYS_DKKD',
    targetSystemName: 'Hệ thống Đăng ký kinh doanh',
    endpoint: 'https://dkkd.gov.vn/api/reconciliation',
    method: 'POST',
    authType: 'OAuth 2.0',
    status: 'active',
    lastUsed: '2024-12-19 15:30:00',
    totalSent: 12
  },
  {
    id: 'API003',
    targetSystem: 'SYS_CONGCHUNG',
    targetSystemName: 'Hệ thống Công chứng',
    endpoint: 'https://congchung.gov.vn/api/reconciliation',
    method: 'POST',
    authType: 'API Key',
    status: 'active',
    lastUsed: '2024-10-15 11:20:00',
    totalSent: 8
  }
];

// Mock data - Phản hồi từ hệ thống đích
const mockFeedbacks: SystemFeedback[] = [
  {
    id: 'FB001',
    packageId: 'PKG001',
    packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
    targetSystem: 'Hệ thống Hộ tịch điện tử',
    receivedDate: '2024-12-20 10:15:00',
    recordsReceived: 850000,
    recordsExpected: 850000,
    dataSize: '2.3 GB',
    status: 'complete',
    statusText: 'Hoàn tất',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    fields: [
      { fieldName: 'Họ và tên', fieldType: 'VARCHAR(255)', recordCount: 850000, completeness: 100 },
      { fieldName: 'Ngày sinh', fieldType: 'DATE', recordCount: 850000, completeness: 100 },
      { fieldName: 'Số CMND/CCCD', fieldType: 'VARCHAR(12)', recordCount: 849856, completeness: 99.98 },
      { fieldName: 'Quê quán', fieldType: 'TEXT', recordCount: 850000, completeness: 100 },
      { fieldName: 'Địa chỉ thường trú', fieldType: 'TEXT', recordCount: 849912, completeness: 99.99 }
    ],
    notes: 'Dữ liệu đã được nhận đầy đủ và xác thực thành công'
  }
];

// Mock data - Log
const mockLogs: LogEntry[] = [
  {
    id: 'LOG001',
    packageId: 'PKG001',
    packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
    action: 'Gửi gói tin',
    user: 'admin@dldc.gov.vn',
    timestamp: '2024-12-20 09:00:00',
    ip: '10.0.0.50',
    details: 'Gửi gói tin thành công đến Hệ thống Hộ tịch điện tử - 850,000 bản ghi',
    status: 'success'
  },
  {
    id: 'LOG002',
    packageId: 'PKG001',
    packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
    action: 'Nhận phản hồi',
    user: 'system@dldc.gov.vn',
    timestamp: '2024-12-20 10:15:00',
    ip: '203.162.10.25',
    details: 'Nhận phản hồi từ Hệ thống Hộ tịch điện tử - Xác nhận 850,000/850,000 bản ghi',
    status: 'success'
  },
  {
    id: 'LOG003',
    packageId: 'PKG002',
    packageName: 'Gói tin đối soát CSDL Doanh nghiệp - Quý 4/2024',
    action: 'Gửi gói tin',
    user: 'admin@dldc.gov.vn',
    timestamp: '2024-12-19 15:30:00',
    ip: '10.0.0.50',
    details: 'Gửi gói tin thành công đến Hệ thống Đăng ký kinh doanh - 125,000 bản ghi',
    status: 'success'
  }
];

// Mock data - Lịch sử
const mockHistory: ReconciliationHistory[] = [
  {
    id: 'HIS001',
    packageId: 'PKG001',
    packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
    targetSystem: 'Hệ thống Hộ tịch điện tử',
    action: 'Hoàn tất đối soát',
    timestamp: '2024-12-20 10:15:00',
    status: 'success',
    recordCount: 850000,
    dataSize: '2.3 GB',
    details: 'Đối soát hoàn tất - Hệ thống đích xác nhận nhận đủ 850,000 bản ghi'
  },
  {
    id: 'HIS002',
    packageId: 'PKG002',
    packageName: 'Gói tin đối soát CSDL Doanh nghiệp - Quý 4/2024',
    targetSystem: 'Hệ thống Đăng ký kinh doanh',
    action: 'Gửi gói tin',
    timestamp: '2024-12-19 15:30:00',
    status: 'success',
    recordCount: 125000,
    dataSize: '1.8 GB',
    details: 'Gửi gói tin thành công - Đang chờ phản hồi từ hệ thống đích'
  },
  {
    id: 'HIS003',
    packageId: 'PKG001',
    packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
    targetSystem: 'Hệ thống Hộ tịch điện tử',
    action: 'Tạo gói tin',
    timestamp: '2024-12-20 08:30:00',
    status: 'success',
    recordCount: 850000,
    dataSize: '2.3 GB',
    details: 'Tạo gói tin đối soát thành công'
  }
];

export function ReconciliationSetupPage() {
  const [activeTab, setActiveTab] = useState<'management' | 'setup' | 'logs' | 'history'>('management');
  const [packages, setPackages] = useState<ReconciliationPackage[]>(mockPackages);
  const [apiConfigs, setAPIConfigs] = useState<APIConfig[]>(mockAPIConfigs);
  const [feedbacks, setFeedbacks] = useState<SystemFeedback[]>(mockFeedbacks);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [history, setHistory] = useState<ReconciliationHistory[]>(mockHistory);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreatePackageModal, setShowCreatePackageModal] = useState(false);
  const [showAPIConfigModal, setShowAPIConfigModal] = useState(false);
  const [showLGSPFormModal, setShowLGSPFormModal] = useState(false);
  const [showFeedbackDetailModal, setShowFeedbackDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<SystemFeedback | null>(null);
  const [sendingPackageId, setSendingPackageId] = useState<string | null>(null);

  // Additional modal states
  const [showPackageDetailModal, setShowPackageDetailModal] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState<ReconciliationPackage | null>(null);
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [packageToSend, setPackageToSend] = useState<ReconciliationPackage | null>(null);
  const [showDeletePackageModal, setShowDeletePackageModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<ReconciliationPackage | null>(null);

  // States cho màn hình đối soát dữ liệu
  const [reconciliationRecords, setReconciliationRecords] = useState<ReconciliationRecord[]>(mockReconciliationRecords);
  const [reconciliationErrors] = useState<ReconciliationError[]>(mockReconciliationErrors);
  const [showRecordDetailModal, setShowRecordDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);

  // Form states for create package - Basic
  const [formPackageName, setFormPackageName] = useState('');
  const [formTargetSystem, setFormTargetSystem] = useState('');
  const [formDataType, setFormDataType] = useState('');
  const [formRecordCount, setFormRecordCount] = useState('');
  const [formDataSize, setFormDataSize] = useState('');

  // Form states for LGSP reconciliation - Extended
  const [activeFormSection, setActiveFormSection] = useState<number>(1);
  const [formSourceSystem, setFormSourceSystem] = useState('');
  const [formReceiverSystem, setFormReceiverSystem] = useState('');
  const [formLGSPServiceCode, setFormLGSPServiceCode] = useState('');
  const [formReconciliationType, setFormReconciliationType] = useState('Ngày');
  const [formConfigStatus, setFormConfigStatus] = useState<'active' | 'paused'>('active');
  const [formFromDate, setFormFromDate] = useState('');
  const [formToDate, setFormToDate] = useState('');
  const [formPeriod, setFormPeriod] = useState('Ngày');
  const [formDataDetailType, setFormDataDetailType] = useState('Chi tiết');
  const [formExpectedRecords, setFormExpectedRecords] = useState('');
  const [formExpectedValue, setFormExpectedValue] = useState('');
  const [formFilterCriteria, setFormFilterCriteria] = useState('');
  const [formLGSPEndpoint, setFormLGSPEndpoint] = useState('');
  const [formServiceName, setFormServiceName] = useState('');
  const [formAPIVersion, setFormAPIVersion] = useState('v2');
  const [formMethod, setFormMethod] = useState('REST');
  const [formSyncType, setFormSyncType] = useState('Đồng bộ');
  const [formTimeout, setFormTimeout] = useState('30');
  const [formCallbackURL, setFormCallbackURL] = useState('');
  const [formAuthMethod, setFormAuthMethod] = useState('Chữ ký số');
  const [formCertificate, setFormCertificate] = useState('');
  const [formSignAlgorithm, setFormSignAlgorithm] = useState('RSA');
  const [formEncryptData, setFormEncryptData] = useState(false);
  const [formIPWhitelist, setFormIPWhitelist] = useState('');
  const [formFrequency, setFormFrequency] = useState('Hàng ngày');
  const [formScheduleTime, setFormScheduleTime] = useState('');
  const [formRetryCount, setFormRetryCount] = useState('3');
  const [formRetryInterval, setFormRetryInterval] = useState('5');
  const [formApprover, setFormApprover] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Filter reconciliation records
  const filteredReconciliationRecords = reconciliationRecords.filter(record =>
    (statusFilter === 'all' || record.status === statusFilter) &&
    (searchTerm === '' || 
     record.datasetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.providerSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.dataType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter packages
  const filteredPackages = packages.filter(pkg =>
    (statusFilter === 'all' || pkg.status === statusFilter) &&
    (searchTerm === '' || 
     pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pkg.targetSystemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pkg.dataType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter API configs
  const filteredAPIConfigs = apiConfigs.filter(config =>
    searchTerm === '' || 
    config.targetSystemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter logs
  const filteredLogs = logs.filter(log =>
    searchTerm === '' ||
    log.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter history
  const filteredHistory = history.filter(hist =>
    searchTerm === '' ||
    hist.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hist.targetSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hist.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleSendPackage = (packageId: string) => {
    setSendingPackageId(packageId);
    
    setTimeout(() => {
      const pkg = packages.find(p => p.id === packageId);
      if (!pkg) return;

      const now = new Date();
      const timestamp = now.toLocaleString('vi-VN');

      setPackages(packages.map(p =>
        p.id === packageId
          ? { ...p, status: 'sent', statusText: 'Đã gửi', statusColor: 'bg-blue-100 text-blue-700 border-blue-200', sentDate: timestamp }
          : p
      ));

      const newLog: LogEntry = {
        id: `LOG${String(logs.length + 1).padStart(3, '0')}`,
        packageId: packageId,
        packageName: pkg.name,
        action: 'Gửi gói tin',
        user: 'admin@dldc.gov.vn',
        timestamp: timestamp,
        ip: '10.0.0.50',
        details: `Gửi gói tin thành công đến ${pkg.targetSystemName} - ${pkg.recordCount.toLocaleString()} bản ghi`,
        status: 'success'
      };

      setLogs([newLog, ...logs]);
      setSendingPackageId(null);
      alert('Gửi gói tin thành công!');
    }, 2000);
  };

  const handleViewFeedback = (packageId: string) => {
    const feedback = feedbacks.find(f => f.packageId === packageId);
    if (feedback) {
      setSelectedFeedback(feedback);
      setShowFeedbackDetailModal(true);
    }
  };

  const getLogStatusBadge = (status: string) => {
    return (
      <StatusTag 
        label={status === 'success' ? 'Thành công' : 'Thất bại'} 
        variant={status === 'success' ? 'green' : 'red'} 
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('management')}
              title="Chuyển sang Quản lý"
              className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'management'
                  ? 'text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Quản lý
              </div>
              {activeTab === 'management' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              title="Chuyển sang Thiết lập"
              className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'setup'
                  ? 'text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Thiết lập
              </div>
              {activeTab === 'setup' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              title="Xem Nhật ký (Logs)"
              className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Log
              </div>
              {activeTab === 'logs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              title="Xem Lịch sử đối soát"
              className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'history'
                  ? 'text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                Lịch sử
              </div>
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tab: Quản lý đối soát dữ liệu */}
          {activeTab === 'management' && (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">Tổng bộ dữ liệu</p>
                      <p className="text-2xl text-blue-900 mt-1">{reconciliationRecords.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">Khớp dữ liệu</p>
                      <p className="text-2xl text-green-900 mt-1">{reconciliationRecords.filter(r => r.status === 'matched').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-700">Không khớp</p>
                      <p className="text-2xl text-orange-900 mt-1">{reconciliationRecords.filter(r => r.status === 'mismatched').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-orange-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">Lỗi</p>
                      <p className="text-2xl text-red-900 mt-1">{reconciliationRecords.filter(r => r.status === 'error').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Actions */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    title="Lọc trạng thái"
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="matched">Khớp dữ liệu</option>
                    <option value="mismatched">Không khớp</option>
                    <option value="pending">Đang xử lý</option>
                    <option value="error">Lỗi</option>
                  </select>
                </div>
                
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm mã bộ dữ liệu, hệ thống cung cấp, loại dữ liệu..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Records Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs text-slate-600">STT</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Mã bộ dữ liệu</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Hệ thống cung cấp</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Loại dữ liệu</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Số bản ghi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Ngày nhận</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Báo cáo sai lệch</th>
                        <th className="px-6 py-3 text-center text-xs text-slate-600">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReconciliationRecords.map((record, index) => (
                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900 font-medium">{record.datasetCode}</div>
                            <div className="text-xs text-slate-500">{record.datasetName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{record.providerSystem}</div>
                            <div className="text-xs text-slate-500">{record.providerSystemCode}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {record.dataType}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {record.recordCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {record.receiveDate}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusTag 
                              label={record.statusText} 
                              variant={record.status === 'matched' ? 'green' : record.status === 'mismatched' ? 'orange' : record.status === 'pending' ? 'blue' : 'red'}
                              icon={record.status === 'matched' && <CheckCircle className="w-3 h-3" />}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.status === 'matched' ? (
                              <span className="text-xs text-slate-400 italic">Không có sai lệch</span>
                            ) : record.isReportSent ? (
                              <StatusTag 
                                label="Đã gửi báo cáo" 
                                variant="indigo" 
                                icon={<Send className="w-3 h-3" />} 
                              />
                            ) : (
                              <StatusTag 
                                label="Chưa gửi báo cáo" 
                                variant="amber" 
                                icon={<Info className="w-3 h-3" />} 
                              />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowRecordDetailModal(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Xem chi tiết"
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

                {filteredReconciliationRecords.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không tìm thấy bản ghi đối soát nào</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab: Thiết lập API */}
          {activeTab === 'setup' && (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Tổng cấu hình API</p>
                      <p className="text-2xl text-slate-900 mt-1">{apiConfigs.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Đang hoạt động</p>
                      <p className="text-2xl text-slate-900 mt-1">{apiConfigs.filter(c => c.status === 'active').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Tổng gói tin đã gửi</p>
                      <p className="text-2xl text-slate-900 mt-1">{apiConfigs.reduce((sum, c) => sum + c.totalSent, 0)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Send className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Actions */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hệ thống đích, endpoint..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setShowAPIConfigModal(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Thêm cấu hình API
                </button>
              </div>

              {/* API Config Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Hệ thống đích</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">API Endpoint</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Phương thức</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Xác thực</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Lần sử dụng cuối</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Tổng gửi</th>
                        <th className="px-6 py-3 text-center text-xs text-slate-600">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAPIConfigs.map((config) => (
                        <tr key={config.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Server className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm text-slate-900">{config.targetSystemName}</div>
                                <div className="text-xs text-slate-500">{config.targetSystem}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900 font-mono">{config.endpoint}</div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusTag label={config.method} variant="blue" />
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {config.authType}
                          </td>
                          <td className="px-6 py-4">
                            <StatusTag 
                              label={config.status === 'active' ? 'Hoạt động' : 'Tạm dừng'} 
                              variant={config.status === 'active' ? 'green' : 'slate'}
                              icon={config.status === 'active' && <CheckCircle className="w-3 h-3" />}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {config.lastUsed || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {config.totalSent}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Kiểm tra kết nối"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredAPIConfigs.length === 0 && (
                  <div className="text-center py-12">
                    <Server className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không tìm thấy cấu hình API nào</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab: Log */}
          {activeTab === 'logs' && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm log theo gói tin, hành động, người dùng..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Xuất log
                </button>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Thời gian</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Gói tin</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Hành động</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Người thực hiện</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">IP</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Chi tiết</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {log.timestamp}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{log.packageName}</div>
                            <div className="text-xs text-slate-500">{log.packageId}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                            {log.ip}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {log.details}
                          </td>
                          <td className="px-6 py-4">
                            {getLogStatusBadge(log.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredLogs.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không tìm thấy log nào</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab: Lịch sử */}
          {activeTab === 'history' && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm lịch sử theo gói tin, hệ thống, hành động..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Xuất báo cáo
                </button>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Thời gian</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Gói tin</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Hệ thống đích</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Hành động</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Số bản ghi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Dung lượng</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((hist) => (
                        <tr key={hist.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {hist.timestamp}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{hist.packageName}</div>
                            <div className="text-xs text-slate-500">{hist.packageId}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {hist.targetSystem}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {hist.action}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {hist.recordCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-blue-600">
                            {hist.dataSize}
                          </td>
                          <td className="px-6 py-4">
                            {getLogStatusBadge(hist.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {hist.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredHistory.length === 0 && (
                  <div className="text-center py-12">
                    <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không tìm thấy lịch sử nào</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal: Chi tiết phản hồi */}
      {showFeedbackDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-slate-900">Chi tiết phản hồi từ hệ thống đích</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedFeedback.packageName}</p>
              </div>
              <button
                onClick={() => setShowFeedbackDetailModal(false)}
                title="Đóng"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Thông tin tổng quan */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700">Hệ thống đích</div>
                  <div className="text-lg text-blue-900 mt-1">{selectedFeedback.targetSystem}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700">Ngày nhận phản hồi</div>
                  <div className="text-lg text-green-900 mt-1">{selectedFeedback.receivedDate}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-700">Bản ghi nhận được</div>
                  <div className="text-lg text-purple-900 mt-1">
                    {selectedFeedback.recordsReceived.toLocaleString()} / {selectedFeedback.recordsExpected.toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    ({((selectedFeedback.recordsReceived / selectedFeedback.recordsExpected) * 100).toFixed(2)}%)
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm text-orange-700">Dung lượng dữ liệu</div>
                  <div className="text-lg text-orange-900 mt-1">{selectedFeedback.dataSize}</div>
                </div>
              </div>

              {/* Trạng thái */}
              <div className="mb-6">
                <div className="text-sm text-slate-600 mb-2">Trạng thái đối soát</div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${selectedFeedback.statusColor}`}>
                  {selectedFeedback.status === 'complete' && <CheckCircle className="w-4 h-4" />}
                  {selectedFeedback.status === 'partial' && <AlertCircle className="w-4 h-4" />}
                  {selectedFeedback.status === 'error' && <X className="w-4 h-4" />}
                  {selectedFeedback.statusText}
                </span>
              </div>

              {/* Chi tiết trường dữ liệu */}
              <div>
                <div className="text-sm text-slate-900 mb-3">Chi tiết trường dữ liệu</div>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Tên trường</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Kiểu dữ liệu</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Số bản ghi</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Tỷ lệ đầy đủ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFeedback.fields.map((field, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="px-4 py-3 text-sm text-slate-900">{field.fieldName}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 font-mono">{field.fieldType}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{field.recordCount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all w-[${field.completeness}%] ${
                                    field.completeness === 100 ? 'bg-green-500' : 
                                    field.completeness >= 99 ? 'bg-blue-500' : 'bg-orange-500'
                                  }`}
                                />
                              </div>
                              <span className="text-sm text-slate-900 whitespace-nowrap">{field.completeness}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedFeedback.notes && (
                <div className="mt-6">
                  <div className="text-sm text-slate-600 mb-2">Ghi chú</div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                    {selectedFeedback.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFeedbackDetailModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                title="Đóng chi tiết phản hồi"
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                title="Xuất báo cáo phản hồi"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tạo gói tin đối soát qua LGSP */}
      <CreateLGSPReconciliationModal
        isOpen={showAPIConfigModal}
        onClose={() => setShowAPIConfigModal(false)}
        onSave={() => {
          alert('Lưu cấu hình gói tin đối soát thành công!');
          setShowAPIConfigModal(false);
        }}
      />

      {/* Modal: Xem chi tiết gói tin */}
      {showPackageDetailModal && selectedPackageDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Chi tiết gói tin đối soát</h3>
              <button onClick={() => setShowPackageDetailModal(false)} className="p-2 hover:bg-slate-100 rounded-lg" title="Đóng chi tiết gói tin">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Thông tin cơ bản</h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-slate-600">Mã gói tin:</span><span className="text-sm text-slate-900 font-medium">{selectedPackageDetail.id}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-600">Tên gói tin:</span><span className="text-sm text-slate-900 font-medium">{selectedPackageDetail.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-600">Số bản ghi:</span><span className="text-sm text-slate-900">{selectedPackageDetail.recordCount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-600">Dung lượng:</span><span className="text-sm text-slate-900">{selectedPackageDetail.dataSize}</span></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowPackageDetailModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200" title="Đóng">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xác nhận xóa */}
      {showDeletePackageModal && packageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200"><h3 className="text-lg text-slate-900">Xác nhận xóa gói tin</h3></div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <div>
                  <p className="text-sm text-slate-900 mb-2">Bạn có chắc chắn muốn xóa gói tin này?</p>
                  <p className="text-sm text-slate-600 mb-3"><strong>{packageToDelete.name}</strong></p>
                  <p className="text-sm text-red-600">Hành động này không thể hoàn tác!</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowDeletePackageModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200" title="Hủy bỏ">Hủy</button>
              <button onClick={() => { setPackages(packages.filter(p => p.id !== packageToDelete.id)); setShowDeletePackageModal(false); alert('Đã xóa gói tin!'); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2" title="Xác nhận xóa gói tin"><Trash2 className="w-4 h-4" />Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xem chi tiết bản ghi đối soát */}
      {showRecordDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-slate-900">Chi tiết bản ghi đối soát</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedRecord.datasetCode}</p>
              </div>
              <button
                onClick={() => setShowRecordDetailModal(false)}
                title="Đóng"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Thông tin tổng quan */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700">Mã bộ dữ liệu</div>
                  <div className="text-lg text-blue-900 mt-1 font-medium">{selectedRecord.datasetCode}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-700">Tên bộ dữ liệu</div>
                  <div className="text-lg text-purple-900 mt-1">{selectedRecord.datasetName}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700">Hệ thống cung cấp</div>
                  <div className="text-lg text-green-900 mt-1">{selectedRecord.providerSystem}</div>
                  <div className="text-xs text-green-600 mt-1">{selectedRecord.providerSystemCode}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm text-orange-700">Loại dữ liệu</div>
                  <div className="text-lg text-orange-900 mt-1">{selectedRecord.dataType}</div>
                </div>
              </div>

              {/* Thông tin đối soát */}
              <div className="mb-6">
                <h4 className="text-sm text-slate-900 mb-3">Thông tin đối soát</h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Số bản ghi:</span>
                    <span className="text-sm text-slate-900 font-medium">{selectedRecord.recordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Ngày nhận:</span>
                    <span className="text-sm text-slate-900">{selectedRecord.receiveDate}</span>
                  </div>
                  {selectedRecord.lastReconcileDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Lần đối soát cuối:</span>
                      <span className="text-sm text-slate-900">{selectedRecord.lastReconcileDate}</span>
                    </div>
                  )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Trạng thái:</span>
                      <StatusTag 
                        label={selectedRecord.statusText} 
                        variant={selectedRecord.status === 'matched' ? 'green' : selectedRecord.status === 'mismatched' ? 'orange' : selectedRecord.status === 'pending' ? 'blue' : 'red'}
                        icon={
                          <>
                            {selectedRecord.status === 'matched' && <CheckCircle className="w-3 h-3" />}
                            {selectedRecord.status === 'mismatched' && <AlertCircle className="w-3 h-3" />}
                            {selectedRecord.status === 'pending' && <Clock className="w-3 h-3" />}
                            {selectedRecord.status === 'error' && <XCircle className="w-3 h-3" />}
                          </>
                        }
                      />
                    </div>
                  {selectedRecord.matchRate !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Tỷ lệ khớp:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all w-[${selectedRecord.matchRate}%] ${
                              selectedRecord.matchRate === 100 ? 'bg-green-500' : 
                              selectedRecord.matchRate >= 95 ? 'bg-blue-500' : 
                              selectedRecord.matchRate >= 80 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="text-sm text-slate-900 font-medium whitespace-nowrap">{selectedRecord.matchRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  )}
                  {selectedRecord.errorCount !== undefined && selectedRecord.errorCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Số lỗi:</span>
                      <span className="text-sm text-red-600 font-medium">{selectedRecord.errorCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowRecordDetailModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}