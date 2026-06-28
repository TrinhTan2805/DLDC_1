import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import {
  Settings,
  CheckCircle2,
  Globe,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  SquarePen,
  Trash2,
  X,
  Save,
  Database,
  List,
  Tag,
  Columns,
  Clock,
  XCircle,
  Check,
  AlertCircle,
  Share2,
  Lock,
  Unlock,
  Download,
  FileDown,
  BarChart3,
  Activity,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Upload
} from 'lucide-react';
import { PowerOff } from 'lucide-react';
import { CreateVersionModal } from './components/modals/CreateVersionModal';
import { ArchiveRecordModal } from './components/modals/ArchiveRecordModal';
import { RecordFormModal } from './components/modals/RecordFormModal';
import { ApprovalRequestModal } from './components/modals/ApprovalRequestModal';
import { Portal } from '../../common/Portal';

interface CategoryPageProps {
  categoryName: string;
  categoryId: string;
}

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'standard' | 'reference' | 'system';
  status: 'pending' | 'approved' | 'published' | 'unpublished' | 'active' | 'inactive';
  createdDate: string;
  version?: number;
  fields: CategoryField[];
}

interface CategoryField {
  id: string;
  name: string;
  dataType: string;
  required: boolean;
  defaultValue?: string;
  maxLength?: number;
  description?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referenceTable?: string;
  referenceField?: string;
}

const MOCK_RECORDS_BY_CATEGORY: Record<string, Category[]> = {
  'category-a-1': [
    { id: '1', code: 'MALE', name: 'Nam', description: 'Giới tính Nam', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'FEMALE', name: 'Nữ', description: 'Giới tính Nữ', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'OTHER', name: 'Khác', description: 'Giới tính khác/chưa xác định', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-2': [
    { id: '1', code: 'KINH', name: 'Kinh', description: 'Dân tộc Kinh', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'TAY', name: 'Tày', description: 'Dân tộc Tày', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'THAI', name: 'Thái', description: 'Dân tộc Thái', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'MUONG', name: 'Mường', description: 'Dân tộc Mường', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '5', code: 'KHOME', name: 'Khơ Me', description: 'Dân tộc Khơ Me', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-3': [
    { id: '1', code: 'VN', name: 'Việt Nam', description: 'Cộng hòa Xã hội Chủ nghĩa Việt Nam', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'US', name: 'Mỹ', description: 'Hợp chủng quốc Hoa Kỳ', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'JP', name: 'Nhật Bản', description: 'Nhật Bản', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'KR', name: 'Hàn Quốc', description: 'Đại Hàn Dân Quốc', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-4': [
    { id: '1', code: 'PG', name: 'Phật giáo', description: 'Đạo Phật', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'CG', name: 'Công giáo', description: 'Đạo Thiên Chúa', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'TL', name: 'Tin lành', description: 'Đạo Tin lành', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'HH', name: 'Hòa Hảo', description: 'Phật giáo Hòa Hảo', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '5', code: 'K', name: 'Không', description: 'Không theo tôn giáo nào', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-5': [
    { id: '1', code: 'BTP', name: 'Bộ Tư Pháp', description: 'Cơ quan ngang bộ trực thuộc Chính phủ', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'CHT', name: 'Cục Hộ tịch, quốc tịch, chứng thực', description: 'Đơn vị trực thuộc Bộ Tư pháp', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'STP_HN', name: 'Sở Tư pháp Hà Nội', description: 'Cơ quan chuyên môn thuộc UBND TP Hà Nội', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-6': [
    { id: '1', code: 'HN', name: 'Thành phố Hà Nội', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'HCM', name: 'Thành phố Hồ Chí Minh', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'DN', name: 'Thành phố Đà Nẵng', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-7': [
    { id: '1', code: 'CH', name: 'Chủ hộ', description: 'Chủ hộ gia đình', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'VC', name: 'Vợ/Chồng', description: 'Quan hệ vợ chồng với chủ hộ', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'CC', name: 'Con đẻ', description: 'Con ruột của chủ hộ', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'BC', name: 'Bố/Mẹ', description: 'Bố mẹ đẻ của chủ hộ', type: 'standard', status: 'published', createdDate: '01/01/2024', version: 1, fields: [] }
  ]
};

export function CategoryPage({ categoryName, categoryId }: CategoryPageProps) {
  const [activeTab, setActiveTab] = useState<'setup' | 'approval' | 'stats' | 'version-history'>('setup');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);
  const [showFieldFormModal, setShowFieldFormModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showApprovalDetailModal, setShowApprovalDetailModal] = useState(false);
  const [showApprovalRequestModal, setShowApprovalRequestModal] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ reviewer: '', note: '' });
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryFields, setNewCategoryFields] = useState<CategoryField[]>([]);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successNotificationMessage, setSuccessNotificationMessage] = useState('');

  // Inline edit & add states
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [inlineEditData, setInlineEditData] = useState({ code: '', name: '', description: '' });
  const [addingRow, setAddingRow] = useState<boolean>(false);
  const [inlineAddData, setInlineAddData] = useState({ code: '', name: '', description: '' });

  const handleSaveInlineEdit = (id: string) => {
    if (!inlineEditData.code.trim() || !inlineEditData.name.trim()) {
      alert('Mã và Tên giá trị không được để trống');
      return;
    }
    setCategories(prev =>
      prev.map(c =>
        c.id === id ? { ...c, code: inlineEditData.code, name: inlineEditData.name, description: inlineEditData.description } : c
      )
    );
    setEditingRowId(null);
    setSuccessNotificationMessage('Đã lưu thay đổi thành công!');
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const handleSaveInlineAdd = () => {
    if (!inlineAddData.code.trim() || !inlineAddData.name.trim()) {
      alert('Mã và Tên giá trị không được để trống');
      return;
    }
    const newId = (categories.length + 1).toString();
    const currentDate = new Date().toLocaleDateString('vi-VN');
    const newCat: Category = {
      id: newId,
      code: inlineAddData.code,
      name: inlineAddData.name,
      description: inlineAddData.description,
      type: 'standard',
      status: 'published',
      createdDate: currentDate,
      version: 1,
      fields: []
    };
    setCategories(prev => [...prev, newCat]);
    setAddingRow(false);
    setSuccessNotificationMessage('Đã thêm bản ghi mới thành công!');
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };
  const [editedCategoryData, setEditedCategoryData] = useState({
    code: '',
    name: '',
    type: 'standard' as 'standard' | 'reference' | 'system',
    status: 'published' as 'pending' | 'approved' | 'published' | 'unpublished' | 'active' | 'inactive',
    description: '',
    approver: ''
  });
  const [archiveRequestData, setArchiveRequestData] = useState({ reason: '', approver: '' });
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [newFieldData, setNewFieldData] = useState({
    name: '',
    dataType: 'TEXT',
    required: false,
    defaultValue: '',
    maxLength: 255,
    description: '',
    isPrimaryKey: false,
    isForeignKey: false,
    referenceTable: '',
    referenceField: ''
  });

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Approval filters
  const [activeApprovalTab, setActiveApprovalTab] = useState<'data-change' | 'unpublish'>('data-change');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('all');
  const [approvalRequestFilter, setApprovalRequestFilter] = useState('all');

  // Bulk approval states
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<number[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [pendingApprovalIds, setPendingApprovalIds] = useState<number[]>([]);

  // Version Popups States
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVersionDetailModal, setShowVersionDetailModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedVersionData, setSelectedVersionData] = useState<any>(null);

  // Mock approvers list
  const approvers = [
    { id: 'approver1', name: 'Hoàng Văn E', role: 'Trưởng phòng Công nghệ thông tin' },
    { id: 'approver2', name: 'Nguyễn Thị F', role: 'Phó phòng CNTT' },
    { id: 'approver3', name: 'Trần Văn G', role: 'Trưởng phòng Pháp chế' },
    { id: 'approver4', name: 'Lê Thị H', role: 'Giám đốc Sở Tư pháp' },
    { id: 'approver5', name: 'Phạm Văn I', role: 'Chuyên viên cao cấp' }
  ];

  // Mock approval data - Value change requests
  const approvalRequests = [
    {
      id: 1,
      recordCode: 'REC001',
      recordName: 'Hà Nội',
      changedFields: ['Tên đầy đủ', 'Mã bưu chính'],
      changes: {
        'Tên đầy đủ': { old: 'Thành phố Hà Nội', new: 'Thủ đô Hà Nội' },
        'Mã bưu chính': { old: '100000', new: '100001' }
      },
      changedBy: 'Nguyễn Văn A',
      changedDate: '15/01/2026 14:30',
      approvedDate: null,
      approvedBy: null,
      status: 'pending'
    },
    {
      id: 2,
      recordCode: 'REC002',
      recordName: 'TP. Hồ Chí Minh',
      changedFields: ['Dân số', 'Diện tích'],
      changes: {
        'Dân số': { old: '8.993.082', new: '9.123.456' },
        'Diện tích': { old: '2.061,4 km²', new: '2.095,5 km²' }
      },
      changedBy: 'Trần Thị B',
      changedDate: '15/01/2026 10:15',
      approvedDate: null,
      approvedBy: null,
      status: 'pending'
    },
    {
      id: 3,
      recordCode: 'REC003',
      recordName: 'Đà Nẵng',
      changedFields: ['Số điện thoại', 'Email liên hệ'],
      changes: {
        'Số điện thoại': { old: '0236.3821.234', new: '0236.3821.999' },
        'Email liên hệ': { old: 'contact@danang.gov.vn', new: 'info@danang.gov.vn' }
      },
      changedBy: 'Phạm Văn C',
      changedDate: '14/01/2026 16:45',
      approvedDate: null,
      approvedBy: null,
      status: 'pending'
    },
    {
      id: 4,
      recordCode: 'REC004',
      recordName: 'Cần Thơ',
      changedFields: ['Website'],
      changes: {
        'Website': { old: 'http://cantho.gov.vn', new: 'https://cantho.gov.vn' }
      },
      changedBy: 'Lê Thị D',
      changedDate: '14/01/2026 09:20',
      approvedDate: '15/01/2026 11:30',
      approvedBy: 'Hoàng Văn E',
      status: 'approved'
    },
    {
      id: 5,
      recordCode: 'REC005',
      recordName: 'Hải Phòng',
      changedFields: ['Tên đầy đủ'],
      changes: {
        'Tên đầy đủ': { old: 'Thành phố Hải Phòng', new: 'TP Hải Phòng' }
      },
      changedBy: 'Đỗ Văn F',
      changedDate: '13/01/2026 15:00',
      approvedDate: '14/01/2026 10:15',
      approvedBy: 'Hoàng Văn E',
      status: 'rejected',
      rejectionReason: 'Tên không phù hợp với quy chuẩn đặt tên hành chính'
    }
  ];

  // Mock approval data - Unpublish requests
  const unpublishRequests = [
    {
      id: 1,
      categoryCode: 'VN01',
      categoryName: 'Hà Nội',
      reason: 'Danh mục đã hết hạn áp dụng theo TT mới',
      requestedBy: 'Nguyễn Văn A',
      requestedDate: '28/05/2026 14:30',
      approvedDate: null,
      approvedBy: null,
      status: 'pending'
    },
    {
      id: 2,
      categoryCode: 'VN02',
      categoryName: 'Hồ Chí Minh',
      reason: 'Cần cập nhật cấu trúc lớn',
      requestedBy: 'Trần Thị B',
      requestedDate: '25/05/2026 10:15',
      approvedDate: '26/05/2026 09:00',
      approvedBy: 'Lãnh đạo Quản trị',
      status: 'approved'
    }
  ];

  const currentRequests = activeApprovalTab === 'data-change' ? approvalRequests : unpublishRequests;

  const approvalStats = {
    pending: currentRequests.filter(r => r.status === 'pending').length,
    approved: currentRequests.filter(r => r.status === 'approved').length,
    rejected: currentRequests.filter(r => r.status === 'rejected').length,
    total: currentRequests.length
  };

  const filteredApprovalRequests = approvalRequests.filter(req => {
    const matchesStatus = approvalStatusFilter === 'all' || req.status === approvalStatusFilter;
    const matchesSearch = searchTerm === '' ||
      req.recordCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.recordName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredUnpublishRequests = unpublishRequests.filter(req => {
    const matchesStatus = approvalStatusFilter === 'all' || req.status === approvalStatusFilter;
    const matchesSearch = searchTerm === '' ||
      req.categoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewApprovalDetail = (request: any) => {
    setSelectedApprovalRequest(request);
    setShowApprovalDetailModal(true);
  };

  const handleApprove = (requestId: number) => {
    // Open approval modal for single request
    setPendingApprovalIds([requestId]);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleReject = (requestId: number) => {
    // Open reject modal for single request
    setPendingApprovalIds([requestId]);
    setApprovalComment('');
    setShowRejectModal(true);
  };

  const handleBulkApprove = () => {
    if (selectedApprovalIds.length === 0) {
      alert('Vui lòng chọn ít nhất một yêu cầu để phê duyệt');
      return;
    }
    setPendingApprovalIds(selectedApprovalIds);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleBulkReject = () => {
    if (selectedApprovalIds.length === 0) {
      alert('Vui lòng chọn ít nhất một yêu cầu để từ chối');
      return;
    }
    setPendingApprovalIds(selectedApprovalIds);
    setApprovalComment('');
    setShowRejectModal(true);
  };

  const confirmApproval = () => {
    // In production, this would call an API
    console.log('Phê duyệt:', pendingApprovalIds, 'Nội dung:', approvalComment);
    setShowApprovalModal(false);
    setSelectedApprovalIds([]);
    setApprovalComment('');
    setPendingApprovalIds([]);
    setSuccessNotificationMessage(
      `Đã phê duyệt thành công ${pendingApprovalIds.length} yêu cầu`
    );
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const confirmReject = () => {
    if (!approvalComment.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    // In production, this would call an API
    console.log('Từ chối:', pendingApprovalIds, 'Lý do:', approvalComment);
    setShowRejectModal(false);
    setSelectedApprovalIds([]);
    setApprovalComment('');
    setPendingApprovalIds([]);
    setSuccessNotificationMessage(
      `Đã từ chối ${pendingApprovalIds.length} yêu cầu`
    );
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const toggleSelectApproval = (id: number) => {
    setSelectedApprovalIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllApprovals = () => {
    const pendingRequests = filteredApprovalRequests.filter(r => r.status === 'pending');
    if (selectedApprovalIds.length === pendingRequests.length) {
      setSelectedApprovalIds([]);
    } else {
      setSelectedApprovalIds(pendingRequests.map(r => r.id));
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case 'create':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tạo mới</span>;
      case 'edit-version':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Phê duyệt phiên bản</span>;
      case 'edit-structure':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Phê duyệt cấu trúc</span>;
      case 'edit-effective':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Phê duyệt hiệu hiệu lực</span>;
      default:
        return null;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Chờ duyệt</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đã duyệt</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Từ chối</span>;
      default:
        return null;
    }
  };

  // Update categories when categoryId changes
  React.useEffect(() => {
    const mockRecords = MOCK_RECORDS_BY_CATEGORY[categoryId] || MOCK_RECORDS_BY_CATEGORY['category-a-1'] || [];
    setCategories(mockRecords);
  }, [categoryId]);

  // Mock data - Danh sách tỉnh thành Việt Nam
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', code: 'VN01', name: 'Hà Nội', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'pending', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '2', code: 'VN02', name: 'Hồ Chí Minh', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'approved', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '3', code: 'VN03', name: 'Đà Nẵng', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'published', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '4', code: 'VN04', name: 'Hải Phòng', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'unpublished', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '5', code: 'VN05', name: 'Cần Thơ', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '6', code: 'VN06', name: 'An Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '7', code: 'VN07', name: 'Bà Rịa - Vũng Tàu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '8', code: 'VN08', name: 'Bắc Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '9', code: 'VN09', name: 'Bắc Kạn', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '10', code: 'VN10', name: 'Bạc Liêu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '11', code: 'VN11', name: 'Bắc Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '12', code: 'VN12', name: 'Bến Tre', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '13', code: 'VN13', name: 'Bình Định', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '14', code: 'VN14', name: 'Bình Dương', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '15', code: 'VN15', name: 'Bình Phước', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '16', code: 'VN16', name: 'Bình Thuận', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '17', code: 'VN17', name: 'Cà Mau', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '18', code: 'VN18', name: 'Cao Bằng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '19', code: 'VN19', name: 'Đắk Lắk', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '20', code: 'VN20', name: 'Đắk Nông', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '21', code: 'VN21', name: 'Điện Biên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '22', code: 'VN22', name: 'Đồng Nai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '23', code: 'VN23', name: 'Đồng Tháp', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '24', code: 'VN24', name: 'Gia Lai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '25', code: 'VN25', name: 'Hà Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '26', code: 'VN26', name: 'Hà Nam', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '27', code: 'VN27', name: 'Hà Tĩnh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '28', code: 'VN28', name: 'Hải Dương', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '29', code: 'VN29', name: 'Hậu Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '30', code: 'VN30', name: 'Hòa Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '31', code: 'VN31', name: 'Hưng Yên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '32', code: 'VN32', name: 'Khánh Hòa', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '33', code: 'VN33', name: 'Kiên Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '34', code: 'VN34', name: 'Kon Tum', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '35', code: 'VN35', name: 'Lai Châu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '36', code: 'VN36', name: 'Lâm Đ��ng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '37', code: 'VN37', name: 'Lạng Sơn', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '38', code: 'VN38', name: 'Lào Cai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '39', code: 'VN39', name: 'Long An', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '40', code: 'VN40', name: 'Nam Định', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '41', code: 'VN41', name: 'Nghệ An', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '42', code: 'VN42', name: 'Ninh Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '43', code: 'VN43', name: 'Ninh Thuận', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '44', code: 'VN44', name: 'Phú Thọ', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '45', code: 'VN45', name: 'Phú Yên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '46', code: 'VN46', name: 'Quảng Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '47', code: 'VN47', name: 'Quảng Nam', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '48', code: 'VN48', name: 'Quảng Ngãi', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '49', code: 'VN49', name: 'Quảng Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '50', code: 'VN50', name: 'Quảng Trị', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '51', code: 'VN51', name: 'Sóc Trăng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '52', code: 'VN52', name: 'Sơn La', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '53', code: 'VN53', name: 'Tây Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '54', code: 'VN54', name: 'Thái Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '55', code: 'VN55', name: 'Thái Nguyên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '56', code: 'VN56', name: 'Thanh Hóa', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '57', code: 'VN57', name: 'Thừa Thiên Huế', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '58', code: 'VN58', name: 'Tiền Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '59', code: 'VN59', name: 'Trà Vinh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '60', code: 'VN60', name: 'Tuyên Quang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '61', code: 'VN61', name: 'Vĩnh Long', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '62', code: 'VN62', name: 'Vĩnh Phúc', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '63', code: 'VN63', name: 'Yên Bái', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] }
  ]);

  const stats = {
    total: categories.length,
    published: categories.filter(c => c.status === 'active' || c.status === 'published').length,
    standard: categories.filter(c => c.type === 'standard').length,
    reference: categories.filter(c => c.type === 'reference').length
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || cat.type === filterType;
    
    const catStatus = cat.status === 'active' ? 'published' : (cat.status === 'inactive' ? 'unpublished' : cat.status);
    const matchesStatus = filterStatus === 'all' || catStatus === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    
    const dateA = new Date(a.createdDate.split('/').reverse().join('-')).getTime();
    const dateB = new Date(b.createdDate.split('/').reverse().join('-')).getTime();
    
    if (sortBy === 'oldest') return dateA - dateB;
    return dateB - dateA; // newest
  });

  const paginatedCategories = filteredCategories.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalCount: number) => {
    if (totalCount <= 0) return null;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalCount);
    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Số bản ghi trên trang"
            value={pageSize}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(e.target.value)); setCurrentPageNum(1); }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">{startItem} - {endItem} / {totalCount}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))} disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer">
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPageNum(Math.min(Math.ceil(totalCount / pageSize), currentPageNum + 1))} disabled={currentPageNum === Math.ceil(totalCount / pageSize)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer">
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'standard':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tiêu chuẩn</span>;
      case 'reference':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Tham chiếu</span>;
      case 'system':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Hệ thống</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status === 'active' ? 'published' : (status === 'inactive' ? 'unpublished' : status);
    switch (normalizedStatus) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full whitespace-nowrap">Trình duyệt</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">Đã phê duyệt</span>;
      case 'published':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">Công khai</span>;
      case 'unpublished':
        return <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-full whitespace-nowrap">Hủy công khai</span>;
      default:
        return null;
    }
  };

  // Handle Excel file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportErrors([]);

    // Read and parse Excel file
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) return;

        // Simple CSV parsing (for demo - in production use a library like xlsx)
        const text = new TextDecoder().decode(data as ArrayBuffer);
        const rows = text.split('\n').map(row => row.split(','));

        // Skip header row and parse data
        const parsedData = rows.slice(1).filter(row => row.length >= 4).map((row, index) => ({
          id: `import-${index}`,
          code: row[0]?.trim() || '',
          name: row[1]?.trim() || '',
          description: row[2]?.trim() || '',
          type: (row[3]?.trim().toLowerCase() === 'tiêu chuẩn' ? 'standard' :
            row[3]?.trim().toLowerCase() === 'tham chiếu' ? 'reference' : 'system') as 'standard' | 'reference' | 'system',
          status: 'active' as 'active' | 'inactive',
          createdDate: new Date().toLocaleDateString('vi-VN'),
          fields: []
        }));

        // Validate data
        const errors: string[] = [];
        parsedData.forEach((item, index) => {
          if (!item.code) errors.push(`Dòng ${index + 2}: Thiếu mã danh mục`);
          if (!item.name) errors.push(`Dòng ${index + 2}: Thiếu tên danh mục`);
        });

        setImportErrors(errors);
        setImportPreviewData(parsedData);
      } catch (error) {
        setImportErrors(['Lỗi khi đọc file. Vui lòng kiểm tra định dạng file.']);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportConfirm = () => {
    if (importErrors.length > 0) {
      alert('Vui lòng sửa các lỗi trước khi nhập dữ liệu');
      return;
    }

    // Add imported data to categories
    setCategories([...categories, ...importPreviewData]);

    // Reset and close modal
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewData([]);
    setImportErrors([]);

    // Show success notification
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const handleCancelImport = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewData([]);
    setImportErrors([]);
  };

  const isAnyModalOpen = !!(
    showArchiveModal || showAddModal || showEditModal || showDetailModal ||
    showAddFieldModal || showCreateVersionModal || showFieldFormModal ||
    showImportModal || showApprovalDetailModal || showApprovalRequestModal ||
    showApprovalModal || showRejectModal || showCompareModal ||
    showVersionDetailModal || showRestoreModal || showAdvancedSearch
  );

  return (
    <div className="space-y-4">
      {/* Tab bar — matches CategorySetupPage style */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-2">
          {[
            { id: 'setup' as const,           label: 'Danh sách',                   icon: List },
            { id: 'approval' as const,         label: 'Phê duyệt',                   icon: CheckCircle2 },
            { id: 'version-history' as const,  label: 'Quản lý phiên bản danh mục',  icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
          {activeTab === 'setup' && (
            <div className="space-y-3">

              {/* Search & Action Bar */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, tên danh mục..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setCurrentPageNum(1); }}
                        className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                        showFilters ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title={showFilters ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}
                    >
                      {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingRow(true);
                        setInlineAddData({ code: '', name: '', description: '' });
                        setEditingRowId(null);
                      }}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm bản ghi mới
                    </button>
                  </div>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Loại danh mục</label>
                        <div className="relative">
                          <select
                            value={filterType}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterType(e.target.value); setCurrentPageNum(1); }}
                            className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                          >
                            <option value="all">Tất cả loại</option>
                            <option value="standard">Tiêu chuẩn</option>
                            <option value="reference">Tham chiếu</option>
                            <option value="system">Hệ thống</option>
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Trạng thái</label>
                        <div className="relative">
                          <select
                            value={filterStatus}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterStatus(e.target.value); setCurrentPageNum(1); }}
                            className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                          >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="published">Đã công khai</option>
                            <option value="unpublished">Ngừng công khai</option>
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Table + Pagination */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên giá trị</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mô tả</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-32">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {paginatedCategories.length > 0 || addingRow ? (
                        <>
                          {paginatedCategories.map((category, index) => {
                            const isEditing = editingRowId === category.id;
                            return (
                              <tr key={category.id} className={`hover:bg-slate-50/50 transition-all group border-b border-slate-100 ${isEditing ? 'bg-blue-50/10' : ''}`}>
                                <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Mã"
                                      value={inlineEditData.code}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, code: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                                      placeholder="Nhập mã"
                                    />
                                  ) : (
                                    <code className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[13px] border border-blue-100 font-mono">
                                      {category.code}
                                    </code>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Tên giá trị"
                                      value={inlineEditData.name}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, name: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                      placeholder="Nhập tên giá trị"
                                    />
                                  ) : (
                                    <div className="text-[13px] text-slate-900 font-normal">{category.name}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-600 font-normal">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Mô tả"
                                      value={inlineEditData.description}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, description: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                      placeholder="Nhập mô tả"
                                    />
                                  ) : (
                                    category.description
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleSaveInlineEdit(category.id)}
                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                        title="Lưu"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setEditingRowId(null)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        title="Hủy"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-all">
                                      <button
                                        onClick={() => {
                                          setEditingRowId(category.id);
                                          setInlineEditData({ code: category.code, name: category.name, description: category.description || '' });
                                          setAddingRow(false);
                                        }}
                                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                        title="Chỉnh sửa"
                                      >
                                        <SquarePen className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => { setSelectedCategory(category); setShowArchiveModal(true); }}
                                        className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                        title="Ngừng áp dụng bản ghi"
                                      >
                                        <PowerOff className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {addingRow && (
                            <tr className="bg-blue-50/20 border-b border-slate-100">
                              <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + paginatedCategories.length + 1}</td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  title="Mã"
                                  value={inlineAddData.code}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, code: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                                  placeholder="Mã *"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  title="Tên giá trị"
                                  value={inlineAddData.name}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, name: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  placeholder="Tên giá trị *"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  title="Mô tả"
                                  value={inlineAddData.description}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, description: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  placeholder="Mô tả"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={handleSaveInlineAdd}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                    title="Lưu"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setAddingRow(false)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hủy"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-[13px] text-slate-400 italic">Không tìm thấy dữ liệu</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(filteredCategories.length)}
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="space-y-6">
              {/* Sub-tabs for Approval */}
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveApprovalTab('data-change')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeApprovalTab === 'data-change'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Phê duyệt thay đổi dữ liệu
                </button>
                <button
                  onClick={() => setActiveApprovalTab('unpublish')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeApprovalTab === 'unpublish'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Phê duyệt hủy công khai
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-700">Chờ phê duyệt</p>
                      <p className="text-2xl text-orange-900">{approvalStats.pending}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Đã phê duyệt</p>
                      <p className="text-2xl text-green-900">{approvalStats.approved}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-red-700">Đã từ chối</p>
                      <p className="text-2xl text-red-900">{approvalStats.rejected}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Tổng yêu cầu</p>
                      <p className="text-2xl text-blue-900">{approvalStats.total}</p>
                    </div>
                  </div>
                </div>
              </div>

              {activeApprovalTab === 'data-change' && (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-slate-900">Phê duyệt thay đổi dữ liệu</h3>
                      <p className="text-sm text-slate-500 mt-1">Quản lý các yêu cầu thay đổi giá trị bản ghi</p>
                    </div>
                {selectedApprovalIds.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">
                      Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> yêu cầu
                    </span>
                    <button
                      onClick={handleBulkApprove}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Phê duyệt hàng loạt
                    </button>
                    <button
                      onClick={handleBulkReject}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Từ chối hàng loạt
                    </button>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      title="Tìm kiếm bản ghi phê duyệt"
                      placeholder="Tìm kiếm theo mã, tên bản ghi..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      title="Lọc trạng thái phê duyệt"
                      value={approvalStatusFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setApprovalStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ phê duyệt</option>
                      <option value="approved">Đã phê duyệt</option>
                      <option value="rejected">Đã từ chối</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            title="Chọn tất cả"
                            checked={selectedApprovalIds.length === filteredApprovalRequests.filter(r => r.status === 'pending').length && filteredApprovalRequests.filter(r => r.status === 'pending').length > 0}
                            onChange={toggleSelectAllApprovals}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã bản ghi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên bản ghi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Các trường thay đổi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người thay đổi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian thay đổi</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian duyệt</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApprovalRequests.map((request, index) => (
                        <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-4">
                            {request.status === 'pending' && (
                              <input
                                type="checkbox"
                                title="Chọn bản ghi"
                                checked={selectedApprovalIds.includes(request.id)}
                                onChange={() => toggleSelectApproval(request.id)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">{index + 1}</td>
                          <td className="px-6 py-4 text-sm">
                            <code className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {request.recordCode}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{request.recordName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {request.changedFields.map((field: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{request.changedBy}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{request.changedDate}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {request.approvedDate ? (
                              <div>
                                <div>{request.approvedDate}</div>
                                <div className="text-xs text-slate-500">bởi {request.approvedBy}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">{getApprovalStatusBadge(request.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewApprovalDetail(request)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(request.id)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Phê duyệt"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(request.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Từ chối"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}

              {activeApprovalTab === 'unpublish' && (
                <>
                  {/* Phê duyệt hủy công khai danh mục */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-slate-900">Phê duyệt hủy công khai danh mục</h3>
                      <p className="text-sm text-slate-500 mt-1">Quản lý các yêu cầu ngừng áp dụng (hủy công khai) danh mục</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">STT</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mã danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lý do hủy</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Người yêu cầu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thời gian yêu cầu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-32">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredUnpublishRequests.map((request, index) => (
                            <tr key={request.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-900">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                  {request.categoryCode}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-900 font-medium">{request.categoryName}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{request.reason}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{request.requestedBy}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{request.requestedDate}</td>
                              <td className="px-4 py-3">
                                {request.status === 'pending' && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Chờ duyệt</span>
                                )}
                                {request.status === 'approved' && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đã duyệt</span>
                                )}
                                {request.status === 'rejected' && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Từ chối</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  {request.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSuccessNotificationMessage('Đã duyệt yêu cầu hủy công khai thành công!');
                                          setShowSuccessNotification(true);
                                          setTimeout(() => setShowSuccessNotification(false), 3000);
                                        }}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        title="Phê duyệt"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => alert('Đã từ chối yêu cầu hủy công khai')}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="Từ chối"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      {/* Add/Edit Modal */}

      {/* Create Version Modal */}
      <CreateVersionModal
        isOpen={showCreateVersionModal}
        onClose={() => setShowCreateVersionModal(false)}
        currentVersion="v3.2"
        onSave={(data: any) => {
          setShowCreateVersionModal(false);
          setSuccessNotificationMessage('Đã tạo phiên bản mới ' + data.name + ' thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      {/* Archive Modal */}
      {showArchiveModal && selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <PowerOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Ngừng áp dụng bản ghi</h3>
                  <p className="text-sm text-slate-500">Yêu cầu ngừng áp dụng bản ghi {selectedCategory.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    Bản ghi ngừng áp dụng sẽ không được sử dụng ở các màn hình nhập liệu khác, nhưng vẫn giữ lại trong lịch sử dữ liệu.
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  title="Người phê duyệt"
                  value={archiveRequestData.approver}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArchiveRequestData({ ...archiveRequestData, approver: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn người phê duyệt</option>
                  {approvers.map((approver) => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Nội dung sao ngừng (Lý do) <span className="text-red-500">*</span>
                </label>
                <textarea
                  title="Lý do ngừng áp dụng"
                  value={archiveRequestData.reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setArchiveRequestData({ ...archiveRequestData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lý do ngừng áp dụng bản ghi..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (!archiveRequestData.approver || !archiveRequestData.reason.trim()) {
                    alert('Vui lòng chọn người phê duyệt và nhập lý do ngừng áp dụng!');
                    return;
                  }
                  
                  // Mock sending request
                  const selectedApprover = approvers.find(a => a.id === archiveRequestData.approver);
                  setSuccessNotificationMessage(`Đã gửi yêu cầu ngừng áp dụng đến ${selectedApprover?.name} (${selectedApprover?.role})`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);
                  
                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovalRequestModal && (
        <ApprovalRequestModal
          isOpen={showApprovalRequestModal}
          onClose={() => setShowApprovalRequestModal(false)}
          data={{ id: 'new', code: 'NEW', name: 'Danh mục mới', type: 'category' }}
          approvers={[
            { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
            { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc', department: 'Trung tâm CNTT' }
          ]}
          form={approvalForm}
          setForm={setApprovalForm}
          onSubmit={() => {
            alert('Đã gửi yêu cầu trình duyệt thành công!');
            setShowApprovalRequestModal(false);
            setShowAddModal(false);
          }}
        />
      )}

      {activeTab === 'version-history' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
             <div>
                <h3 className="font-bold text-slate-800 text-[15px]">Danh sách phiên bản</h3>
                <p className="text-sm text-slate-500 mt-1">Quản lý, tra cứu và đóng băng các phiên bản của danh mục hệ thống</p>
             </div>

          </div>
          {/* Version History Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Phiên bản</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Ngày thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Người thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Loại thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Nội dung thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    {
                      version: 'v3.2',
                      date: '05/01/2026',
                      user: 'Nguyễn Văn A',
                      changeType: 'Cấu trúc',
                      changes: 'Thêm trường "Số điện thoại liên hệ"',
                      status: 'active'
                    },
                    {
                      version: 'v3.1',
                      date: '28/12/2025',
                      user: 'Trần Thị B',
                      changeType: 'Dữ liệu',
                      changes: 'Cập nhật 15 bản ghi tỉnh thành',
                      status: 'archived'
                    },
                    {
                      version: 'v3.0',
                      date: '15/12/2025',
                      user: 'Lê Văn C',
                      changeType: 'Cấu trúc',
                      changes: 'Thay đổi kiểu dữ liệu trường "Mã tỉnh"',
                      status: 'archived'
                    },
                    {
                      version: 'v2.5',
                      date: '01/12/2025',
                      user: 'Phạm Thị D',
                      changeType: 'Quy tắc',
                      changes: 'Thêm ràng buộc unique cho mã tỉnh',
                      status: 'archived'
                    },
                    {
                      version: 'v2.0',
                      date: '20/11/2025',
                      user: 'Hoàng Văn E',
                      changeType: 'Cấu trúc',
                      changes: 'Khởi tạo danh mục 63 tỉnh thành',
                      status: 'archived'
                    }
                  ].map((history, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">{history.version}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{history.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{history.user}</td>
                      <td className="px-4 py-3">
                        {history.changeType === 'Cấu trúc' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            Cấu trúc
                          </span>
                        )}
                        {history.changeType === 'Dữ liệu' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Dữ liệu
                          </span>
                        )}
                        {history.changeType === 'Quy tắc' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Quy tắc
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{history.changes}</td>
                      <td className="px-4 py-3">
                        {history.status === 'active' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Đang dùng
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                            Hết hiệu lực
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                               setSelectedVersionData(history);
                               setShowVersionDetailModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {history.status === 'active' && (
                            <button
                              onClick={() => {
                                setSelectedCategory({
                                  id: '1', code: 'VN01', name: 'Hà Nội', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'active', createdDate: '01/01/2024', fields: []
                                });
                                setEditedCategoryData({
                                  code: 'VN01',
                                  name: 'Hà Nội',
                                  type: 'standard',
                                  status: 'active',
                                  description: 'Thành phố trực thuộc Trung ương',
                                  approver: ''
                                });
                                setShowEditModal(true);
                              }}
                              className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                              title="Chỉnh sửa danh mục"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {history.status === 'archived' && (
                            <>
                               <button
                                 onClick={() => {
                                    setSelectedVersionData(history);
                                    setShowRestoreModal(true);
                                 }}
                                 className="p-1 text-green-600 hover:bg-green-50 rounded"
                                 title="Nâng cấp làm phiên bản nháp (Khôi phục)"
                               >
                                 <Clock className="w-4 h-4" />
                               </button>
                               <button
                                 onClick={() => alert(`Đã khóa tham chiếu phiên bản ${history.version}`)}
                                 className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                 title="Khóa phiên bản (Không cho tham chiếu)"
                               >
                                 <Lock className="w-4 h-4" />
                               </button>
                            </>
                          )}
                          <button
                            onClick={() => alert('Đang tải xuống dữ liệu phiên bản ' + history.version)}
                            className="p-1 text-slate-600 hover:bg-slate-50 rounded"
                            title="Tải xuống"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Version Comparison Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-sm text-slate-900 mb-4">So sánh phiên bản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Phiên bản cũ</label>
                <select
                  title="Phiên bản cũ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="v2.0">v2.0 - 20/11/2025</option>
                  <option value="v2.5">v2.5 - 01/12/2025</option>
                  <option value="v3.0">v3.0 - 15/12/2025</option>
                  <option value="v3.1">v3.1 - 28/12/2025</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Phiên bản mới</label>
                <select
                  title="Phiên bản mới"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="v3.2">v3.2 - 05/01/2026 (Hiện tại)</option>
                  <option value="v3.1">v3.1 - 28/12/2025</option>
                  <option value="v3.0">v3.0 - 15/12/2025</option>
                  <option value="v2.5">v2.5 - 01/12/2025</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                So sánh
              </button>
              <button 
                onClick={() => alert('Đang xuất báo cáo so sánh...')}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo so sánh
              </button>
            </div>
          </div>
        </div>
      )}




      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAddFieldModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowAddFieldModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Tên trường *</label>
                  <input
                    type="text"
                    title="Tên trường"
                    value={newFieldData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên trường"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Kiểu dữ liệu *</label>
                  <select
                    title="Kiểu dữ liệu"
                    value={newFieldData.dataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Bắt buộc *</label>
                  <select
                    title="Trường bắt buộc"
                    value={newFieldData.required ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, required: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Giá trị mặc định</label>
                  <input
                    type="text"
                    title="Giá trị mặc định"
                    value={newFieldData.defaultValue || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giá trị mặc định"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowAddFieldModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setNewCategoryFields([...newCategoryFields, { ...newFieldData, id: Date.now().toString() }]);
                  setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm trường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Form Modal */}
      {showFieldFormModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={() => setShowFieldFormModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowFieldFormModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Tên trường *</label>
                  <input
                    type="text"
                    title="Tên trường"
                    value={newFieldData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setNewFieldData({ ...newFieldData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors({ ...fieldErrors, name: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 border ${fieldErrors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tên trường"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Kiểu dữ liệu *</label>
                  <select
                    title="Kiểu dữ liệu"
                    value={newFieldData.dataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="EMAIL">Email</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Khóa chính</label>
                  <select
                    title="Khóa chính"
                    value={newFieldData.isPrimaryKey ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const isPrimary = e.target.value === 'true';
                      setNewFieldData({ ...newFieldData, isPrimaryKey: isPrimary });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Bắt buộc *</label>
                  <select
                    title="Trường bắt buộc"
                    value={newFieldData.required ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, required: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Độ dài tối đa</label>
                  <input
                    type="number"
                    title="Độ dài tối đa"
                    value={newFieldData.maxLength || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, maxLength: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập độ dài tối đa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Giá trị mặc định</label>
                <input
                  type="text"
                  title="Giá trị mặc định"
                  value={newFieldData.defaultValue || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá trị mặc định"
                />
              </div>

              {/* Foreign Key Section */}
              <div className="border-t border-slate-200 pt-4">
                <div className="mb-3">
                  <label className="block text-sm text-slate-700 mb-1">Khóa ngoại</label>
                  <select
                    title="Khóa ngoại"
                    value={newFieldData.isForeignKey ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const isForeign = e.target.value === 'true';
                      setNewFieldData({ ...newFieldData, isForeignKey: isForeign });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>

                {newFieldData.isForeignKey && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Bảng tham chiếu *</label>
                      <select
                        title="Bảng tham chiếu"
                        value={newFieldData.referenceTable || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setNewFieldData({ ...newFieldData, referenceTable: e.target.value });
                          if (fieldErrors.referenceTable) {
                            setFieldErrors({ ...fieldErrors, referenceTable: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border ${fieldErrors.referenceTable ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Chọn bảng</option>
                        <option value="danh_muc_a">Biên tập danh mục A</option>
                        <option value="danh_muc_b">Danh mục B</option>
                        <option value="danh_muc_c">Danh mục C</option>
                      </select>
                      {fieldErrors.referenceTable && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.referenceTable}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Trường tham chiếu *</label>
                      <select
                        title="Trường tham chiếu"
                        value={newFieldData.referenceField || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setNewFieldData({ ...newFieldData, referenceField: e.target.value });
                          if (fieldErrors.referenceField) {
                            setFieldErrors({ ...fieldErrors, referenceField: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border ${fieldErrors.referenceField ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Chọn trường</option>
                        <option value="id">ID</option>
                        <option value="ma_code">Mã Code</option>
                        <option value="ten">Tên</option>
                      </select>
                      {fieldErrors.referenceField && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.referenceField}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  title="Mô tả"
                  value={newFieldData.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewFieldData({ ...newFieldData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả về trường..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFieldFormModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Validation
                  const errors: { [key: string]: string } = {};

                  // Kiểm tra tên trường bắt buộc
                  if (!newFieldData.name.trim()) {
                    errors.name = 'Tên trường không được để trống';
                  }

                  // Kiểm tra trùng tên trường (ngoại trừ trường đang sửa)
                  const isDuplicate = newCategoryFields.some((field, index) =>
                    field.name.toLowerCase() === newFieldData.name.toLowerCase() &&
                    index !== editingFieldIndex
                  );
                  if (isDuplicate) {
                    errors.name = 'Tên trường đã tồn tại';
                  }

                  // Kiểm tra khóa ngoại
                  if (newFieldData.isForeignKey) {
                    if (!newFieldData.referenceTable) {
                      errors.referenceTable = 'Vui lòng chọn bảng tham chiếu';
                    }
                    if (!newFieldData.referenceField) {
                      errors.referenceField = 'Vui lòng chọn trường tham chiếu';
                    }
                  }

                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    return;
                  }

                  // Nếu đang đặt khóa chính, bỏ khóa chính của các trường khác
                  let fieldsToUpdate = [...newCategoryFields];
                  if (newFieldData.isPrimaryKey) {
                    fieldsToUpdate = fieldsToUpdate.map(f => ({ ...f, isPrimaryKey: false }));
                  }

                  if (editingFieldIndex !== null) {
                    fieldsToUpdate[editingFieldIndex] = { ...newFieldData, id: newCategoryFields[editingFieldIndex].id };
                    setNewCategoryFields(fieldsToUpdate);
                  } else {
                    setNewCategoryFields([...fieldsToUpdate, { ...newFieldData, id: Date.now().toString() }]);
                  }
                  setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                  setEditingFieldIndex(null);
                  setFieldErrors({});
                  setShowFieldFormModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm trường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImportModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={handleCancelImport}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Nhập dữ liệu từ Excel</h3>
                  <p className="text-sm text-slate-500">Tải lên file Excel để nhập hàng loạt danh mục</p>
                </div>
              </div>
              <button onClick={handleCancelImport} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block text-sm text-slate-700 mb-2">
                  Chọn file Excel <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input title="Trường dữ liệu"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      {importFile ? importFile.name : 'Nhấn để chọn file hoặc kéo thả file vào đây'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Hỗ trợ: .xlsx, .xls, .csv (Tối đa 10MB)
                    </p>
                  </label>
                </div>

                {/* Template Download */}
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <a href="#" className="text-blue-600 hover:underline">
                    Tải file mẫu Excel
                  </a>
                  <span className="text-slate-500">để xem cấu trúc dữ liệu yêu cầu</span>
                </div>
              </div>

              {/* Format Guide */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Định dạng file Excel yêu cầu
                </h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Cột 1: Mã danh mục (bắt buộc)</p>
                  <p>• Cột 2: Tên danh mục (bắt buộc)</p>
                  <p>• Cột 3: Mô tả</p>
                  <p>• Cột 4: Loại danh mục (Tiêu chuẩn / Tham chiếu / Hệ thống)</p>
                  <p>• Dòng đầu tiên là tiêu đề cột, dữ liệu bắt đầu từ dòng thứ 2</p>
                </div>
              </div>

              {/* Errors */}
              {importErrors.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm text-red-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Phát hiện {importErrors.length} lỗi
                  </h4>
                  <ul className="text-xs text-red-800 space-y-1 max-h-32 overflow-y-auto">
                    {importErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview Data */}
              {importPreviewData.length > 0 && (
                <div>
                  <h4 className="text-sm text-slate-900 mb-3">
                    Xem trước dữ liệu ({importPreviewData.length} bản ghi)
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Mã danh mục</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Tên danh mục</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Loại</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {importPreviewData.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.code}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{item.description}</td>
                              <td className="px-4 py-3">{getTypeBadge(item.type)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="text-sm text-slate-600">
                {importPreviewData.length > 0 && (
                  <span>Sẵn sàng nhập {importPreviewData.length} bản ghi</span>
                )}
              </div>
              <div className="flex gap-3">
                <button title="Đóng" aria-label="Đóng"
                  onClick={handleCancelImport}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImportConfirm}
                  disabled={importPreviewData.length === 0 || importErrors.length > 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Xác nhận nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Detail Modal */}
      {showApprovalDetailModal && selectedApprovalRequest && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={() => setShowApprovalDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Chi tiết thay đổi</h3>
                  <p className="text-sm text-slate-500">Xem các thay đổi của bản ghi</p>
                </div>
              </div>
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowApprovalDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Record Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Mã bản ghi</label>
                    <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {selectedApprovalRequest.recordCode}
                    </code>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Tên bản ghi</label>
                    <div className="text-sm text-slate-900">{selectedApprovalRequest.recordName}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Người thay đổi</label>
                    <div className="text-sm text-slate-900">{selectedApprovalRequest.changedBy}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Thời gian thay đổi</label>
                    <div className="text-sm text-slate-900">{selectedApprovalRequest.changedDate}</div>
                  </div>
                  {selectedApprovalRequest.approvedDate && (
                    <>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Người phê duyệt</label>
                        <div className="text-sm text-slate-900">{selectedApprovalRequest.approvedBy}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Thời gian phê duyệt</label>
                        <div className="text-sm text-slate-900">{selectedApprovalRequest.approvedDate}</div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Trạng thái</label>
                    {getApprovalStatusBadge(selectedApprovalRequest.status)}
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Các thay đổi ({selectedApprovalRequest.changedFields.length})</h4>
                <div className="space-y-4">
                  {Object.entries(selectedApprovalRequest.changes).map(([fieldName, values]: [string, any]) => (
                    <div key={fieldName} className="border border-slate-200 rounded-lg p-4">
                      <div className="text-sm text-slate-700 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <strong>{fieldName}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Giá trị cũ</label>
                          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-900">
                            {values.old}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Giá trị mới</label>
                          <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-900">
                            {values.new}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedApprovalRequest.status === 'rejected' && selectedApprovalRequest.rejectionReason && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Lý do từ chối
                  </h4>
                  <p className="text-sm text-red-800">{selectedApprovalRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
              <button
                onClick={() => setShowApprovalDetailModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              {selectedApprovalRequest.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleReject(selectedApprovalRequest.id);
                      setShowApprovalDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedApprovalRequest.id);
                      setShowApprovalDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Phê duyệt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => {
            setShowApprovalModal(false);
            setApprovalComment('');
            setPendingApprovalIds([]);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Xác nhận phê duyệt</h3>
                  <p className="text-sm text-slate-500">Phê duyệt {pendingApprovalIds.length} yêu cầu thay đổi</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Nội dung phê duyệt <span className="text-slate-400">(Không bắt buộc)</span>
                </label>
                <textarea
                  title="Ghi chú phê duyệt"
                  value={approvalComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung phê duyệt, ghi chú hoặc ý kiến (nếu có)..."
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium">Lưu ý:</p>
                    <p className="mt-1">Sau khi phê duyệt, các thay đổi sẽ được áp dụng vào hệ thống và không thể hoàn tác.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComment('');
                  setPendingApprovalIds([]);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmApproval}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => {
            setShowRejectModal(false);
            setApprovalComment('');
            setPendingApprovalIds([]);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Xác nhận từ chối</h3>
                  <p className="text-sm text-slate-500">Từ chối {pendingApprovalIds.length} yêu cầu thay đổi</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Lý do từ chối <span className="text-red-600">*</span>
                </label>
                <textarea
                  title="Lý do từ chối"
                  value={approvalComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lý do từ chối yêu cầu thay đổi..."
                />
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-red-700">
                    <p className="font-medium">Lưu ý:</p>
                    <p className="mt-1">Vui lòng nhập rõ lý do từ chối để người yêu cầu có thể hiểu và chỉnh sửa lại.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setApprovalComment('');
                  setPendingApprovalIds([]);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[420px]">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-900">Gửi yêu cầu thành công</h4>
              <p className="text-xs text-green-700 mt-1">
                {successNotificationMessage || 'Yêu cầu chỉnh sửa danh mục đã được gửi đến bộ phận phê duyệt'}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              title="Đóng thông báo"
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowCompareModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                 <BarChart3 className="w-5 h-5 text-blue-600"/>
                 <h3 className="text-[17px] font-bold">So sánh phiên bản dữ liệu</h3>
              </div>
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-4">
                 <p className="text-[14px] text-blue-800">Đang so sánh <strong>v2.0</strong> với <strong>v3.2 (Hiện tại)</strong></p>
                 <p className="text-[13px] text-slate-600 mt-1">Phát hiện <span className="font-bold text-red-600">3 thay đổi</span> về cấu trúc và <span className="font-bold text-orange-600">1 thay đổi</span> về quy tắc.</p>
              </div>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-700">
                     <tr>
                       <th className="px-4 py-3 font-semibold w-1/4">Tên trường / Thuộc tính</th>
                       <th className="px-4 py-3 font-semibold w-[15%]">Hành động</th>
                       <th className="px-4 py-3 font-semibold w-[30%]">Phiên bản cũ (v2.0)</th>
                       <th className="px-4 py-3 font-semibold w-[30%]">Phiên bản mới (v3.2)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {/* Added Field */}
                     <tr className="bg-green-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Số điện thoại liên hệ</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Thêm mới</span></td>
                       <td className="px-4 py-3 text-slate-500 italic">Chưa có</td>
                       <td className="px-4 py-3 text-slate-800">
                         <div className="flex flex-col gap-1">
                           <span>Kiểu dữ liệu: <code className="bg-white border border-slate-200 px-1 rounded text-blue-600">string</code></span>
                           <span>Chiều dài: <code className="bg-white border border-slate-200 px-1 rounded">20</code></span>
                         </div>
                       </td>
                     </tr>
                     {/* Modified Field - DataType */}
                     <tr className="bg-blue-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Mã tỉnh</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Sửa kiểu dữ liệu</span></td>
                       <td className="px-4 py-3 text-slate-800">
                         Kiểu dữ liệu: <code className="bg-white border border-slate-200 px-1 rounded text-red-600">number</code>
                       </td>
                       <td className="px-4 py-3 text-green-700 font-medium">
                         Kiểu dữ liệu: <code className="bg-white border border-slate-200 px-1 rounded text-green-600">string</code>
                       </td>
                     </tr>
                     {/* Modified Field - Constraint */}
                     <tr className="bg-purple-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Mã tỉnh</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">Sửa ràng buộc</span></td>
                       <td className="px-4 py-3 text-slate-800">
                         Unique Index: <span className="text-red-500 font-medium">Không có</span>
                       </td>
                       <td className="px-4 py-3 text-green-700 font-medium">
                         Unique Index: <span className="text-green-600 font-medium">Đã thiết lập</span>
                       </td>
                     </tr>
                     {/* Removed Field */}
                     <tr className="bg-red-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Ghi chú phụ</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Xóa bỏ</span></td>
                       <td className="px-4 py-3 text-slate-800">
                         Trường dữ liệu kiểu <code className="bg-white border border-slate-200 px-1 rounded">string</code>
                       </td>
                       <td className="px-4 py-3 text-slate-500 italic">
                         Đã gỡ bỏ khỏi cấu trúc
                       </td>
                     </tr>
                   </tbody>
                 </table>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowCompareModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-[14px]">
 Đóng
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Detail Modal */}
      {showVersionDetailModal && selectedVersionData && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowVersionDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Eye className="w-5 h-5 text-blue-600"/>
                 <h3 className="text-[17px] font-bold text-slate-800">Chi tiết phiên bản {selectedVersionData.version}</h3>
              </div>
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowVersionDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
               <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div><span className="text-slate-500">Người cập nhật:</span> <strong className="text-slate-800 block text-[14px]">{selectedVersionData.changedBy}</strong></div>
                  <div><span className="text-slate-500">Thời gian cập nhật:</span> <strong className="text-slate-800 block text-[14px]">{selectedVersionData.date}</strong></div>
                  <div><span className="text-slate-500">Loại thay đổi:</span> <span className={`inline-block px-2.5 py-1 mt-1 rounded-full text-xs font-medium ${
                      selectedVersionData.type === 'Cấu trúc' ? 'bg-purple-100 text-purple-700' :
                      selectedVersionData.type === 'Dữ liệu' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{selectedVersionData.type}</span></div>
                  <div><span className="text-slate-500">Trạng thái:</span> <span className={`inline-block px-2.5 py-1 mt-1 rounded-full text-xs font-medium ${
                      selectedVersionData.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{selectedVersionData.status === 'active' ? 'Đang dùng' : 'Lưu trữ'}</span></div>
               </div>
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                 <h4 className="font-semibold text-slate-700 mb-2 text-[13px]">Nội dung thay đổi chi tiết</h4>
                 <p className="text-[14px] text-slate-800">{selectedVersionData.description}</p>
               </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end bg-slate-50">
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowVersionDetailModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-[14px]">
 Đóng
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedVersionData && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowRestoreModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200">
              <div className="flex flex-col items-center gap-3 text-center">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                   <Clock className="w-6 h-6"/>
                 </div>
                 <div>
                    <h3 className="text-[18px] font-bold text-slate-800">Xác nhận khôi phục</h3>
                    <p className="text-[14px] text-slate-500 mt-1">Khôi phục về phiên bản <strong>{selectedVersionData.version}</strong>?</p>
                 </div>
              </div>
            </div>
            <div className="p-5 text-[14px] text-slate-600 text-center">
              Hệ thống sẽ tạo ra một phiên bản mới (Nháp) dựa trên dữ liệu của phiên bản {selectedVersionData.version}. Các cấu trúc hiện tại sẽ không bị ghi đè cho đến khi bạn xác nhận và lưu.
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-center gap-3 bg-slate-50">
              <button onClick={() => setShowRestoreModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-[14px] flex-1">
 Hủy
 </button>
              <button onClick={() => {
 setShowRestoreModal(false);
 setSuccessNotificationMessage(`Khôi phục thành công dự thảo làm việc từ phiên bản ${selectedVersionData.version}`);
 setShowSuccessNotification(true);
 }} className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-[14px] flex-1 flex items-center justify-center gap-2">
 <CheckCircle2 className="w-5 h-5"/> Khôi phục
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Version Modal */}
      {showCreateVersionModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowCreateVersionModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-[16px]">Tạo phiên bản mới</h3>
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowCreateVersionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[13px] text-blue-800 flex gap-2">
                 <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                 <p>Hệ thống sẽ sao chép cấu trúc và nội dung từ bản ghi hiện tại để tạo thành nền tảng cho phiên bản nâng cấp tiếp theo.</p>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Tên phiên bản <span className="text-red-500">*</span></label>
                 <input title="Tên phiên bản" type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" defaultValue="v3.3" />
              </div>
              
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày bắt đầu hiệu lực <span className="text-red-500">*</span></label>
                 <input title="Ngày bắt đầu hiệu lực" type="date" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả thay đổi</label>
                 <textarea title="Mô tả thay đổi" rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Nhập lý do tạo mới hoặc các nội dung dự kiến thay đổi..."></textarea>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-lg">
               <button onClick={() => setShowCreateVersionModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Hủy bỏ</button>
               <button onClick={() => {
 setShowCreateVersionModal(false);
 setSuccessNotificationMessage("Đã tạo và lưu trữ phiên bản mới xuất phát từ cấu trúc hiện tại.");
 setShowSuccessNotification(true);
 }} className="px-5 py-2.5 bg-blue-600 rounded-xl text-sm text-white hover:bg-blue-700 flex items-center gap-2">
 <Save className="w-4 h-4"/> Lưu phiên bản
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAdvancedSearch(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Tìm kiếm nâng cao</h3>
              </div>
              <button
                title="Đóng"
                onClick={() => setShowAdvancedSearch(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Chủ đề (Loại danh mục)
                  </label>
                  <select
                    title="Loại danh mục"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="reference">Tham chiếu</option>
                    <option value="system">Hệ thống</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    title="Sắp xếp theo"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="newest">Ngày tạo mới nhất</option>
                    <option value="oldest">Ngày tạo cũ nhất</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    title="Trạng thái"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Trình duyệt</option>
                    <option value="approved">Đã phê duyệt</option>
                    <option value="published">Công khai</option>
                    <option value="unpublished">Hủy công khai</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                  setSortBy('newest');
                }}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}