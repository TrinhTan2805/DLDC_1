import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Upload, Filter, FileText, Info, Edit, CheckCircle, XCircle, Eye, Clock, FileCheck, Shield, History as HistoryIcon, File, ExternalLink, CheckSquare, ChevronDown, RotateCcw, ArrowLeft, PlusCircle, PauseCircle, PlayCircle } from 'lucide-react';

interface OpenDataCategoryPageProps {
  categoryName: string;
  categoryId: string;
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

interface VersionHistoryItem {
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
  const [activeTab, setActiveTab] = useState<'category' | 'approval' | 'version' | 'schedule'>('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  // Danh sách người phê duyệt
  const approvers = [
    { id: '1', name: 'Nguyễn Văn An - Trưởng phòng' },
    { id: '2', name: 'Trần Thị Bình - Phó phòng' },
    { id: '3', name: 'Lê Văn Cường - Giám đốc' },
    { id: '4', name: 'Phạm Thị Dung - Phó giám đốc' },
  ];

  // Schedule states
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: 1,
      datasetCode: 'ODCAT001',
      datasetName: 'Mục 1',
      categoryName: 'Biên tập danh mục A',
      frequency: 'daily',
      startTime: '08:00',
      dataSource: 'https://api.example.com/data/legal-docs',
      status: 'active',
      lastRun: '26/12/2024 08:00',
      nextRun: '27/12/2024 08:00',
      createdBy: 'Nguyễn Văn A',
      createdDate: '20/12/2024'
    },
    {
      id: 2,
      datasetCode: 'ODCAT002',
      datasetName: 'Mục 2',
      categoryName: 'Danh mục B',
      frequency: 'weekly',
      startTime: '09:00',
      dataSource: 'https://api.example.com/data/business-registry',
      status: 'active',
      lastRun: '23/12/2024 09:00',
      nextRun: '30/12/2024 09:00',
      createdBy: 'Trần Thị B',
      createdDate: '18/12/2024'
    }
  ]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<Set<number>>(new Set());
  const [scheduleFormData, setScheduleFormData] = useState({
    datasetId: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly' | 'quarterly',
    startTime: '08:00',
    startDate: '',
    endDate: '',
    publishFormat: 'api' as 'api' | 'file',
    targetAudience: '',
    contactInfo: '',
    dataSource: ''
  });
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const totalItems = data.length;
  const activeItems = data.filter(item => item.status === 'active').length;
  const inactiveItems = data.filter(item => item.status === 'inactive').length;

  const handleStatsClick = (filter: string) => {
    setStatusFilter(filter);
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
    setShowBulkSubmitApprovalModal(false);
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
            <button onClick={() => setSubmitActiveTab('category')} className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${submitActiveTab === 'category' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
               <FileText className="w-4 h-4" />
               Thông tin danh mục
            </button>
            <button onClick={() => setSubmitActiveTab('metadata')} className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${submitActiveTab === 'metadata' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
               <File className="w-4 h-4" />
               Thông tin Metadata
            </button>
            <button onClick={() => setSubmitActiveTab('license')} className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${submitActiveTab === 'license' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
               <Shield className="w-4 h-4" />
               Thông tin giấy phép
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          {submitActiveTab === 'category' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-w-6xl mx-auto">
              <div className="p-4 border-b border-slate-200 border-l-4 border-l-emerald-500">
                <h2 className="text-lg font-medium text-slate-800">{isApproving ? "Danh sách danh mục đang chờ phê duyệt" : "Danh sách danh mục cần phê duyệt"}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left"><input type="checkbox" aria-label="Chọn tất cả" title="Chọn tất cả" checked={true} readOnly className="w-4 h-4 text-emerald-600 rounded" /></th>
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
                        <td className="px-4 py-3"><input type="checkbox" aria-label={`Chọn mục ${item.name}`} title={`Chọn mục ${item.name}`} checked={true} readOnly className="w-4 h-4 text-emerald-600 rounded" /></td>
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                        <input type="checkbox" aria-label="Danh mục tư pháp" title="Danh mục tư pháp" checked={true} readOnly className="rounded border-slate-300 w-4 h-4 cursor-pointer" />
                        CAT001 - Văn bản pháp luật
                      </label>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1 text-slate-800">Hộ tịch</div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 ml-2">
                        <input type="checkbox" aria-label="Danh mục hộ tịch" title="Danh mục hộ tịch" readOnly className="rounded border-slate-300 w-4 h-4 cursor-pointer" />
                        CAT002 - Hộ tịch
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Chọn một hoặc nhiều danh mục cho Metadata này.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả *</label>
                  <textarea rows={3} aria-label="Mô tả metadata" title="Mô tả metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue={`Metadata cho dữ liệu mở ${categoryName}`}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Từ khóa</label>
                  <input type="text" aria-label="Từ khóa metadata" title="Từ khóa metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue="luật, mở, thống kê" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Giấy phép *</label>
                    <select aria-label="Giấy phép metadata" title="Giấy phép metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm bg-white">
                      <option>Giấy phép dữ liệu mở công cộng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Định dạng</label>
                    <select aria-label="Định dạng metadata" title="Định dạng metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm bg-white">
                      <option>CSV</option>
                      <option>JSON</option>
                      <option>XML</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nguồn dữ liệu *</label>
                    <input type="text" aria-label="Nguồn dữ liệu" title="Nguồn dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue="API nội bộ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tần suất cập nhật</label>
                    <select aria-label="Tần suất cập nhật" title="Tần suất cập nhật" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white shadow-sm">
                      <option>Hàng tháng</option>
                    </select>
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
                  <input type="text" aria-label="Tên giấy phép" title="Tên giấy phép" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue="Giấy phép dữ liệu mở công cộng" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả *</label>
                  <textarea rows={3} aria-label="Mô tả giấy phép" title="Mô tả giấy phép" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue="Cho phép sử dụng và phân phối dữ liệu mở."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Điều kiện sử dụng *</label>
                  <textarea rows={3} aria-label="Điều kiện sử dụng" title="Điều kiện sử dụng" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue="Ghi nguồn là bắt buộc."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Liên kết tham chiếu *</label>
                  <input type="text" aria-label="Liên kết tham chiếu" title="Liên kết tham chiếu" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm" defaultValue="https://example.com/license/cc0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                  <select aria-label="Trạng thái giấy phép" title="Trạng thái giấy phép" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white shadow-sm">
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
    <div className="h-full flex flex-col bg-slate-50 relative z-0">
      {/* Header removed */}

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('category')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'category'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <FileText className="w-4 h-4" />
            Thông tin danh mục
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'approval'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <CheckCircle className="w-4 h-4" />
            Phê duyệt
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'version'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <HistoryIcon className="w-4 h-4" />
            Lịch sử thay đổi
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'schedule'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <Clock className="w-4 h-4" />
            Thiết lập công bố
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab 1: Quản lý danh mục */}
        {activeTab === 'category' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã, tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="w-48 relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                    aria-label="Lọc theo trạng thái"
                    title="Lọc theo trạng thái"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  {activeTab === 'category' && (
                    <>
                      <button
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        <Upload className="w-4 h-4" />
                        Import
                      </button>
                      <button
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </>
                  )}
                </div>
              </div>
              {(searchTerm || statusFilter !== 'all') && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <span>Hiển thị: {filteredData.length} / {totalItems} bản ghi</span>
                  {(searchTerm || statusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              {/* Bulk Actions Bar */}
              <div className={`border-b px-4 py-3 flex items-center justify-between transition-colors ${selectedIds.size > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-sm ${selectedIds.size > 0 ? 'text-emerald-900' : 'text-slate-500'}`}>
                  Đã chọn <strong>{selectedIds.size}</strong> mục
                </span>
                <div className="flex items-center gap-2">
                  {activeTab === 'category' && (
                    <>
                      <button
                        onClick={() => setShowBulkPublishModal(true)}
                        disabled={selectedIds.size === 0}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${selectedIds.size > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Công bố
                      </button>
                      <button
                        onClick={() => setShowBulkUnpublishModal(true)}
                        disabled={selectedIds.size === 0}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${selectedIds.size > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        <XCircle className="w-4 h-4" />
                        Hủy công bố
                      </button>
                      <button
                        onClick={() => {
                          setSubmitItems(data.filter(item => selectedIds.has(item.id)));
                          setSubmitActiveTab('category');
                          setIsSubmitting(true);
                        }}
                        disabled={selectedIds.size === 0}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${selectedIds.size > 0 ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        <FileCheck className="w-4 h-4" />
                        Trình duyệt
                      </button>
                    </>
                  )}
                  {activeTab === 'approval' && (
                    <button
                      onClick={() => {
                        setSubmitItems(data.filter(item => selectedIds.has(item.id)));
                        setSubmitActiveTab('category');
                        setIsApproving(true);
                      }}
                      disabled={selectedIds.size === 0}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${selectedIds.size > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Phê duyệt
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    disabled={selectedIds.size === 0}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedIds.size > 0 ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                          aria-label="Chọn tất cả danh mục"
                          title="Chọn tất cả danh mục"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phê duyệt</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Công khai</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người cập nhật</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr key={item.id} className={`hover:bg-slate-50 ${selectedIds.has(item.id) ? 'bg-emerald-50' : ''}`}>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                              aria-label={`Chọn mục ${item.name}`}
                              title={`Chọn mục ${item.name}`}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                          <td className="px-4 py-3">
                            <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                              {item.code}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                          <td className="px-4 py-3">
                            {item.status === 'active' ? (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                                Không hoạt động
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.approvalStatus === 'approved' ? (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                                Đã phê duyệt
                              </span>
                            ) : item.approvalStatus === 'pending' ? (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full">
                                Chờ phê duyệt
                              </span>
                            ) : item.approvalStatus === 'rejected' ? (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full">
                                Từ chối
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                                Nháp
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.publishStatus === 'published' ? (
                              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
                                Đã công khai
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                                Chưa công khai
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">{item.createdDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{item.updatedBy}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowDetailModal(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {activeTab === 'category' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setShowEditModal(true);
                                    }}
                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  {item.publishStatus === 'published' ? (
                                    <button
                                      onClick={() => handleUnpublish(item)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Hủy công bố"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePublish(item)}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                      title="Công bố"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                              {activeTab === 'approval' && (
                                <button
                                  onClick={() => {
                                    setSubmitItems([item]);
                                    setSubmitActiveTab('category');
                                    setIsApproving(true);
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Phê duyệt"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-500">
                          Không tìm thấy dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Phê duyệt (Dashboard) */}
        {activeTab === 'approval' && (
          <div className="space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 pt-6 px-6 pb-0">
               <h2 className="text-xl font-bold text-slate-800">Phê duyệt danh mục</h2>
               <p className="text-sm text-slate-500 mt-1">Lãnh đạo nghiệp vụ xem xét và phê duyệt các yêu cầu thay đổi dữ liệu chủ</p>
               <div className="flex gap-8 mt-6 overflow-x-auto">
                 <button className="whitespace-nowrap pb-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm flex items-center gap-2">
                   <CheckSquare className="w-4 h-4" /> Phê duyệt danh mục
                 </button>
                 <button className="whitespace-nowrap pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2 transition-colors">
                   <FileCheck className="w-4 h-4" /> Phê duyệt cấu trúc
                 </button>
                 <button className="whitespace-nowrap pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2 transition-colors">
                   <Clock className="w-4 h-4" /> Phê duyệt phiên bản
                 </button>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 relative overflow-hidden shadow-sm">
                 <div className="text-orange-700 font-medium text-sm flex items-center justify-between z-10 relative">
                    <span>Chờ phê duyệt</span>
                    <Clock className="w-5 h-5 text-orange-400" />
                 </div>
                 <div className="text-orange-600 font-bold text-3xl mt-2 z-10 relative">{data.filter(item => item.approvalStatus === 'pending').length}</div>
               </div>
               <div className="bg-green-50 border border-green-200 rounded-xl p-5 relative overflow-hidden shadow-sm">
                 <div className="text-green-700 font-medium text-sm flex items-center justify-between z-10 relative">
                    <span>Đã phê duyệt</span>
                    <CheckSquare className="w-5 h-5 text-green-400" />
                 </div>
                 <div className="text-green-600 font-bold text-3xl mt-2 z-10 relative">{data.filter(item => item.approvalStatus === 'approved').length}</div>
               </div>
               <div className="bg-red-50 border border-red-200 rounded-xl p-5 relative overflow-hidden shadow-sm">
                 <div className="text-red-700 font-medium text-sm flex items-center justify-between z-10 relative">
                    <span>Từ chối</span>
                    <XCircle className="w-5 h-5 text-red-400" />
                 </div>
                 <div className="text-red-600 font-bold text-3xl mt-2 z-10 relative">{data.filter(item => item.approvalStatus === 'rejected').length}</div>
               </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap lg:flex-nowrap items-center gap-4">
               <span className="text-sm font-semibold text-slate-700 shrink-0">Trạng thái:</span>
               <div className="flex flex-wrap items-center gap-2">
                 <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm transition-colors">Tất cả ({data.length})</button>
                 <button className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors">Chờ phê duyệt ({data.filter(item => item.approvalStatus === 'pending').length})</button>
                 <button className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors">Đã phê duyệt ({data.filter(item => item.approvalStatus === 'approved').length})</button>
                 <button className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors opacity-50 cursor-not-allowed">Duyệt một phần (0)</button>
                 <button className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors">Từ chối ({data.filter(item => item.approvalStatus === 'rejected').length})</button>
               </div>
             </div>

             <div className="space-y-4">
               {data.map(item => (
                 <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all relative group">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                         <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                         {item.approvalStatus === 'pending' && <span className="px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 rounded-full whitespace-nowrap">Chờ phê duyệt</span>}
                         {item.approvalStatus === 'approved' && <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 border border-green-200 rounded-full whitespace-nowrap">Đã phê duyệt</span>}
                         {item.approvalStatus === 'rejected' && <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded-full whitespace-nowrap">Từ chối</span>}
                      </div>
                      
                      <div className="text-orange-600 font-medium text-sm">Mã: {item.code}</div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm">
                         <div><span className="text-slate-500">Cơ quan quản lý:</span> <span className="font-medium text-slate-800">Cục Hộ tịch - Quốc tịch - Chứng thực</span></div>
                         <div><span className="text-slate-500">Loại dữ liệu:</span> <span className="font-medium text-slate-800">Dữ liệu chuẩn</span></div>
                         <div><span className="text-slate-500">Ngày gửi:</span> <span className="font-medium text-slate-800">{item.updatedDate} 14:30</span></div>
                         <div><span className="text-slate-500">Người gửi:</span> <span className="font-medium text-slate-800">{item.updatedBy || 'Nguyễn Văn A'}</span></div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-50">
                         <span className="flex items-center gap-1">• 15 thuộc tính</span>
                         <span className="flex items-center gap-1">• 3 quy tắc hợp nhất</span>
                         <span className="flex items-center gap-1">• 2 quan hệ</span>
                         <span className="flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle className="w-4 h-4"/> Có định danh</span>
                      </div>

                      <button className="text-slate-500 hover:text-slate-800 text-sm flex items-center gap-1 mt-2 font-medium transition-colors">
                         <HistoryIcon className="w-4 h-4"/> Lịch sử cập nhật (1) <ChevronDown className="w-4 h-4 ml-1"/>
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[150px] justify-start md:border-l md:border-slate-100 md:pl-6 shrink-0 mt-4 md:mt-0">
                       <button className="w-full px-4 py-2 bg-white border border-blue-600 text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 shadow-sm transition-colors">
                         <Eye className="w-4 h-4"/> Xem chi tiết
                       </button>
                       {item.approvalStatus === 'pending' && (
                         <>
                           <button 
                              onClick={() => {
                                 setSelectedItem(item);
                                 setSubmitItems([item]);
                                 setSubmitActiveTab('category');
                                 setIsApproving(true);
                              }}
                              className="w-full px-4 py-2 bg-emerald-600 border border-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm transition-colors"
                            >
                             <CheckCircle className="w-4 h-4"/> Phê duyệt
                           </button>
                           <button className="w-full px-4 py-2 bg-red-600 border border-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 shadow-sm transition-colors">
                             <XCircle className="w-4 h-4"/> Từ chối
                           </button>
                         </>
                       )}
                    </div>
                 </div>
               ))}
               {data.length === 0 && (
                 <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <div className="text-slate-400 mb-2"><CheckSquare className="w-12 h-12 mx-auto opacity-50" /></div>
                    <div className="text-slate-600 font-medium">Không có yêu cầu phê duyệt nào</div>
                 </div>
               )}
             </div>
          </div>
        )}

        {/* Tab 4: Version History */}

        {activeTab === 'version' && (
          <div className="space-y-6">
            {!selectedDatasetForVersion ? (
              // Master View
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Quản lý phiên bản dữ liệu mở</h2>
                  <p className="text-sm text-slate-500 mb-6">Theo dõi và quản lý lịch sử các phiên bản của tập dữ liệu.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên tập dữ liệu</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phiên bản hiện tại</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Cập nhật gần nhất</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người cập nhật</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {filteredData.map(item => (
                           <tr key={item.id} className="hover:bg-slate-50">
                             <td className="px-4 py-3 text-sm"><code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">{item.code}</code></td>
                             <td className="px-4 py-3 text-sm text-slate-900 font-medium">{item.name}</td>
                             <td className="px-4 py-3 text-sm text-slate-600">v1.3</td>
                             <td className="px-4 py-3 text-sm text-slate-600">{item.updatedDate}</td>
                             <td className="px-4 py-3 text-sm text-slate-600">{item.updatedBy || 'Nguyễn Văn A'}</td>
                             <td className="px-4 py-3 text-sm">
                               <button 
                                 onClick={() => setSelectedDatasetForVersion(item)}
                                 className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-xs"
                               >
                                 <HistoryIcon className="w-3.5 h-3.5" /> Chi tiết phiên bản
                               </button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              // Detail View
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-t-lg">
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setSelectedDatasetForVersion(null)}
                       className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                       title="Quay lại danh sách"
                     >
                       <ArrowLeft className="w-4 h-4" />
                     </button>
                     <div>
                       <h2 className="text-lg font-bold text-slate-800">{selectedDatasetForVersion.name}</h2>
                       <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                          <span>Mã: <code className="text-emerald-600 font-medium">{selectedDatasetForVersion.code}</code></span>
                          <span>•</span>
                          <span>Trạng thái: <span className="text-green-600 font-medium">Hoạt động</span></span>
                       </div>
                     </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm text-sm font-medium transition-colors">
                     <PlusCircle className="w-4 h-4" /> Tạo bản cập nhật
                  </button>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phiên bản</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-1/3">Mô tả thay đổi</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người cập nhật</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày cập nhật</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleVersionHistory.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-700">{item.version}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 leading-relaxed">{item.changes}</td>
                            <td className="px-4 py-3 text-sm text-slate-900">{item.updatedBy}</td>
                            <td className="px-4 py-3 text-sm text-slate-900">{item.updatedDate}</td>
                            <td className="px-4 py-3 text-sm">
                              {item.status === 'Hiện tại' ? (
                                <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-medium">Hiện tại</span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">Lịch sử</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => alert(`Đang tải về bộ dữ liệu phiên bản ${item.version}...`)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title={`Tải xuống bản ${item.version}`}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                {item.status === 'Lịch sử' && (
                                  <button
                                    onClick={() => {
                                       setSelectedVersionToRestore(item);
                                       setShowRestoreModal(true);
                                    }}
                                    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                    title={`Khôi phục về bản ${item.version}`}
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                )}
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
          </div>
        )}

        {/* Tab 5: Schedule Auto Publish */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-slate-900">Danh sách lịch công bố tự động</h2>
                <p className="text-sm text-slate-600 mt-1">Thiết lập lịch tự động cập nhật và công bố dữ liệu</p>
              </div>
              <button
                onClick={() => {
                  setScheduleFormData({
                    datasetId: '',
                    frequency: 'daily',
                    startTime: '08:00',
                    dataSource: ''
                  });
                  setSelectedCategoryIds(new Set());
                  setSelectedDatasetIds(new Set());
                  setSelectedSchedule(null);
                  setShowScheduleModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm lịch mới
              </button>
            </div>

            {/* Schedules Table */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Danh mục</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã dataset</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên dataset</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tần suất</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Giờ chạy</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Lần chạy cuối</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Lần chạy tiếp theo</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedules.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                          Chưa có lịch công bố tự động nào được thiết lập
                        </td>
                      </tr>
                    ) : (
                      schedules.map(schedule => (
                        <tr key={schedule.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-600">{schedule.categoryName || categoryName}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{schedule.datasetCode}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{schedule.datasetName}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            {schedule.frequency === 'daily' && 'Hàng ngày'}
                            {schedule.frequency === 'weekly' && 'Hàng tuần'}
                            {schedule.frequency === 'monthly' && 'Hàng tháng'}
                            {schedule.frequency === 'quarterly' && 'Hàng quý'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">{schedule.startTime}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{schedule.lastRun || '-'}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{schedule.nextRun}</td>
                          <td className="px-4 py-3 text-sm">
                            {schedule.status === 'active' ? (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                                Đang hoạt động
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                                Tạm dừng
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsEditingSchedule(false);
                                  setShowScheduleModal(true);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsEditingSchedule(true);
                                  setScheduleFormData({
                                     datasetId: schedule.datasetCode,
                                     frequency: schedule.frequency,
                                     startTime: schedule.startTime,
                                     dataSource: schedule.dataSource,
                                  });
                                  setShowScheduleModal(true);
                                }}
                                className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                                title="Sửa lịch"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {schedule.status === 'active' ? (
                                <button
                                  onClick={() => {
                                    setSchedules(schedules.map(s => s.id === schedule.id ? {...s, status: 'inactive'} : s));
                                  }}
                                  className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                  title="Tạm dừng công bố"
                                >
                                  <PauseCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSchedules(schedules.map(s => s.id === schedule.id ? {...s, status: 'active'} : s));
                                  }}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  title="Tiếp tục công bố"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </button>
                              )}
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
                    setShowSubmitApprovalModal(true);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">Chi tiết {categoryName}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.code}
                  aria-label="Mã"
                  title="Mã"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.name}
                  aria-label="Tên"
                  title="Tên"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  rows={3}
                  value={selectedItem?.description}
                  aria-label="Mô tả"
                  title="Mô tả"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  aria-label="Trạng thái"
                  title="Trạng thái"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái phê duyệt</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50">
                  {selectedItem.approvalStatus === 'approved' ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                      Đã phê duyệt
                    </span>
                  ) : selectedItem.approvalStatus === 'pending' ? (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full">
                      Chờ phê duyệt
                    </span>
                  ) : selectedItem.approvalStatus === 'rejected' ? (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full">
                      Từ chối
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                      Nháp
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái công khai</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50">
                  {selectedItem?.publishStatus === 'published' ? (
                    <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
                      Đã công khai
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                      Chưa công khai
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Ngày tạo</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.createdDate}
                  aria-label="Ngày tạo"
                  title="Ngày tạo"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Người cập nhật</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.updatedBy}
                  aria-label="Người cập nhật"
                  title="Người cập nhật"
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
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
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Công khai
                  </button>
                )}

                {/* Unpublish - when published */}
                {selectedItem.publishStatus === 'published' && (
                  <button
                    onClick={() => {
                      setData(data.map(item =>
                        item.id === selectedItem.id
                          ? { ...item, publishStatus: 'unpublished' as const }
                          : item
                      ));
                      setShowDetailModal(false);
                      setSelectedItem(null);
                      alert('Đã bỏ công khai thành công!');
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Bỏ công khai
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">Chỉnh sửa {categoryName}</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-2 mb-4">
                <HistoryIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Hệ thống đã tự động tạo nhánh phiên bản mới để bạn chỉnh sửa. Phiên bản gốc không bị ảnh hưởng cho đến khi phiên bản này được công bố.
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phiên bản hiện tại</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                    value="v1.3"
                    aria-label="Phiên bản hiện tại"
                    title="Phiên bản hiện tại"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phiên bản đang sửa</label>
                  <div className="flex w-full px-3 py-2 border border-blue-300 rounded-lg bg-blue-50 text-blue-700 gap-2 items-center">
                    <span className="font-medium">v1.4</span>
                    <span className="px-2 py-0.5 text-[10px] bg-blue-100 border border-blue-200 rounded-full">Bản nháp mới</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  defaultValue={selectedItem?.code}
                  aria-label="Mã"
                  readOnly
                  title="Mã danh mục không thể thay đổi sau khi khởi tạo"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue={selectedItem?.name}
                  aria-label="Tên"
                  title="Tên"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  defaultValue={selectedItem?.description}
                  aria-label="Mô tả"
                  title="Mô tả"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue={selectedItem?.status}
                  aria-label="Trạng thái"
                  title="Trạng thái"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              {/* Display current approval status */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Trạng thái phê duyệt:</span>
                  {selectedItem.approvalStatus === 'approved' ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                      Đã phê duyệt
                    </span>
                  ) : selectedItem.approvalStatus === 'pending' ? (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full">
                      Chờ phê duyệt
                    </span>
                  ) : selectedItem.approvalStatus === 'rejected' ? (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full">
                      Từ chối
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                      Nháp
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                {/* Submit for approval button */}
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowSubmitApprovalModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedItem.approvalStatus === 'approved'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
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
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert('Hệ thống đã lưu thành công nhánh phiên bản mới đang chỉnh sửa (v1.4). Các thay đổi này cần được phê duyệt trước khi công bố!');
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
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

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-slate-900 mb-4">
              {selectedSchedule ? (isEditingSchedule ? 'Sửa lịch công bố tự động' : 'Chi tiết lịch công bố') : 'Thêm lịch công bố tự động'}
            </h2>

            <div className="space-y-4">
              {/* Màn Chọn Danh mục */}
              {!selectedSchedule && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Chọn danh mục và Dataset áp dụng <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-slate-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5"
                          checked={selectedCategoryIds.size === availableCategories.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategoryIds(new Set(availableCategories.map(cat => cat.id)));
                            } else {
                              setSelectedCategoryIds(new Set());
                              setSelectedDatasetIds(new Set());
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900">Chọn tất cả danh mục</div>
                        </div>
                      </label>
                      <div className="border-t border-slate-200 my-2"></div>
                      {availableCategories.map(category => (
                        <label key={category.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-0.5"
                            checked={selectedCategoryIds.has(category.id)}
                            onChange={(e) => {
                              const newSet = new Set(selectedCategoryIds);
                              if (e.target.checked) {
                                newSet.add(category.id);
                              } else {
                                newSet.delete(category.id);
                                // Clear datasets from this category
                                setSelectedDatasetIds(new Set());
                              }
                              setSelectedCategoryIds(newSet);
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-sm text-slate-900">{category.name}</div>
                            <div className="text-xs text-slate-500">{category.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Đã chọn {selectedCategoryIds.size} bảng danh mục
                  </p>
                </div>
              )}

              {/* Select Dataset */}
              <div>
                {!selectedSchedule && (
                  <label className="block text-sm text-slate-700 mt-4 mb-2">
                    Các Dataset được chọn <span className="text-red-500">*</span>
                  </label>
                )}
                {selectedSchedule ? (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-sm">
                      <span className="text-slate-600">Danh mục: </span>
                      <span className="text-slate-900">{selectedSchedule.categoryName || categoryName}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-slate-600">Mã: </span>
                      <span className="text-slate-900">{selectedSchedule.datasetCode}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-slate-600">Tên: </span>
                      <span className="text-slate-900">{selectedSchedule.datasetName}</span>
                    </div>
                  </div>
                ) : (
                  <div className={`border rounded-lg p-3 max-h-48 overflow-y-auto ${selectedCategoryIds.size === 0 ? 'border-slate-200 bg-slate-50' : 'border-slate-300'
                    }`}>
                    <div className="space-y-2">
                      {selectedCategoryIds.size === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                          Vui lòng chọn bảng danh mục trước
                        </p>
                      ) : data.filter(item => item.approvalStatus === 'approved').length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                          Không có dataset nào đã được phê duyệt
                        </p>
                      ) : (
                        <>
                          <label className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="mt-0.5"
                              checked={selectedDatasetIds.size === data.filter(item => item.approvalStatus === 'approved').length && data.filter(item => item.approvalStatus === 'approved').length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDatasetIds(new Set(data.filter(item => item.approvalStatus === 'approved').map(item => item.id)));
                                } else {
                                  setSelectedDatasetIds(new Set());
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="text-sm text-slate-900">Chọn tất cả dataset</div>
                            </div>
                          </label>
                          <div className="border-t border-slate-200 my-2"></div>
                          {Array.from(selectedCategoryIds).map(categoryId => {
                            const category = availableCategories.find(c => c.id === categoryId);
                            return (
                              <div key={categoryId} className="mb-3">
                                <div className="text-xs text-slate-600 mb-1 px-2 py-1 bg-emerald-50 rounded">
                                  📁 {category?.name}
                                </div>
                                {data.filter(item => item.approvalStatus === 'approved').map(item => (
                                  <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer ml-2">
                                    <input
                                      type="checkbox"
                                      className="mt-0.5"
                                      checked={selectedDatasetIds.has(item.id)}
                                      onChange={(e) => {
                                        const newSet = new Set(selectedDatasetIds);
                                        if (e.target.checked) {
                                          newSet.add(item.id);
                                        } else {
                                          newSet.delete(item.id);
                                        }
                                        setSelectedDatasetIds(newSet);
                                      }}
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm text-slate-900">{item.code} - {item.name}</div>
                                      <div className="text-xs text-slate-500">{item.description}</div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  {selectedSchedule
                    ? 'Chỉ hiển thị các dataset đã được phê duyệt'
                    : `Đã chọn ${selectedDatasetIds.size} dataset từ ${selectedCategoryIds.size} danh mục`
                  }
                </p>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật <span className="text-red-500">*</span></label>
                {selectedSchedule && !isEditingSchedule ? (
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-900">
                    {selectedSchedule.frequency === 'daily' && 'Hàng ngày'}
                    {selectedSchedule.frequency === 'weekly' && 'Hàng tuần'}
                    {selectedSchedule.frequency === 'monthly' && 'Hàng tháng'}
                    {selectedSchedule.frequency === 'quarterly' && 'Hàng quý'}
                  </div>
                ) : (
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={scheduleFormData.frequency}
                    aria-label="Tần suất cập nhật"
                    title="Tần suất cập nhật"
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, frequency: e.target.value as any })}
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần (Thứ 2 hàng tuần)</option>
                    <option value="monthly">Hàng tháng (Ngày 1 hàng tháng)</option>
                    <option value="quarterly">Hàng quý (Ngày 1 quý)</option>
                  </select>
                )}
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Thời gian áp dụng <span className="text-red-500">*</span></label>
                {selectedSchedule && !isEditingSchedule ? (
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-900">
                    <div className="grid grid-cols-3 gap-4">
                      <div><span className="text-slate-500 text-xs block">Giờ chạy:</span> {selectedSchedule.startTime}</div>
                      <div><span className="text-slate-500 text-xs block">Từ ngày:</span> {selectedSchedule.startDate || '-'}</div>
                      <div><span className="text-slate-500 text-xs block">Đến ngày:</span> {selectedSchedule.endDate || '-'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Giờ chạy tự động</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={scheduleFormData.startTime}
                        aria-label="Thời gian bắt đầu"
                        title="Thời gian bắt đầu"
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Từ ngày</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={scheduleFormData.startDate}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Đến ngày</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={scheduleFormData.endDate}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Khung thời gian hệ thống sẽ tự động chạy tác vụ
                </p>
              </div>

              {/* Publish format */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Hình thức công bố <span className="text-red-500">*</span></label>
                {selectedSchedule && !isEditingSchedule ? (
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-900">
                    {selectedSchedule.publishFormat === 'api' ? 'Chia sẻ qua API' : 'Tải lên File'}
                  </div>
                ) : (
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={scheduleFormData.publishFormat}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, publishFormat: e.target.value as 'api' | 'file' })}
                  >
                    <option value="api">API (Giao diện lập trình ứng dụng)</option>
                    <option value="file">File dữ liệu (Tải nguyên tệp)</option>
                  </select>
                )}
              </div>

              {/* Data Source */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Nguồn dữ liệu (URL / Đường dẫn) <span className="text-red-500">*</span></label>
                {selectedSchedule && !isEditingSchedule ? (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-sm text-slate-900 break-all">
                      {selectedSchedule.dataSource}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      <strong>Cấu hình tác vụ:</strong>
                      <ul className="list-disc ml-4 mt-1 space-y-1">
                        <li>Tự động tải dữ liệu từ nguồn</li>
                        <li>Cập nhật metadata</li>
                        <li>Công bố lên Cổng dữ liệu mở</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="https://api.example.com/data/endpoint"
                      value={scheduleFormData.dataSource}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, dataSource: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      URL API hoặc đường dẫn file dữ liệu nguồn
                    </p>
                  </>
                )}
              </div>

              {/* Step 7: Target Audience and Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Đối tượng sử dụng (tuỳ chọn)</label>
                  {selectedSchedule && !isEditingSchedule ? (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-900">
                      {selectedSchedule.targetAudience || '-'}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="VD: Doanh nghiệp, Người dân..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={scheduleFormData.targetAudience}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, targetAudience: e.target.value })}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Thông tin liên hệ (tuỳ chọn)</label>
                  {selectedSchedule && !isEditingSchedule ? (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-900">
                      {selectedSchedule.contactInfo || '-'}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Email hoặc SĐT..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={scheduleFormData.contactInfo}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, contactInfo: e.target.value })}
                    />
                  )}
                </div>
              </div>

              {selectedSchedule && !isEditingSchedule && (
                <>
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-sm text-slate-700 mb-3">Thông tin lịch chạy</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-600">Lần chạy cuối</div>
                        <div className="text-sm text-slate-900 mt-1">{selectedSchedule.lastRun || 'Chưa chạy'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600">Lần chạy tiếp theo</div>
                        <div className="text-sm text-slate-900 mt-1">{selectedSchedule.nextRun}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600">Người tạo</div>
                        <div className="text-sm text-slate-900 mt-1">{selectedSchedule.createdBy}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600">Ngày tạo</div>
                        <div className="text-sm text-slate-900 mt-1">{selectedSchedule.createdDate}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                    <select
                      aria-label="Trạng thái"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={selectedSchedule.status}
                      onChange={(e) => {
                        setSchedules(schedules.map(s =>
                          s.id === selectedSchedule.id
                            ? { ...s, status: e.target.value as 'active' | 'inactive' }
                            : s
                        ));
                        setSelectedSchedule({ ...selectedSchedule, status: e.target.value as 'active' | 'inactive' });
                      }}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedSchedule(null);
                  setIsEditingSchedule(false);
                  setSelectedCategoryIds(new Set());
                  setSelectedDatasetIds(new Set());
                  setScheduleFormData({
                    datasetId: '',
                    frequency: 'daily',
                    startTime: '08:00',
                    startDate: '',
                    endDate: '',
                    publishFormat: 'api',
                    targetAudience: '',
                    contactInfo: '',
                    dataSource: ''
                  });
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                {selectedSchedule && !isEditingSchedule ? 'Đóng' : 'Hủy'}
              </button>
              {(!selectedSchedule || isEditingSchedule) && (
                <button
                  onClick={() => {
                    if (selectedDatasetIds.size === 0 && !isEditingSchedule) {
                      alert('Vui lòng chọn ít nhất 1 dataset!');
                      return;
                    }
                    if (!scheduleFormData.dataSource) {
                      alert('Vui lòng nhập nguồn dữ liệu!');
                      return;
                    }

                    if (isEditingSchedule && selectedSchedule) {
                      setSchedules(schedules.map(s => s.id === selectedSchedule.id ? { ...s, ...scheduleFormData } : s));
                      setShowScheduleModal(false);
                      setSelectedSchedule(null);
                      setIsEditingSchedule(false);
                      alert('Đã cập nhật cấu hình lịch công bố!');
                      return;
                    }

                    // Tạo lịch cho tất cả các dataset đã chọn
                    const newSchedules: ScheduleItem[] = [];
                    let currentId = schedules.length + 1;

                    selectedDatasetIds.forEach(datasetId => {
                      const selectedDataset = data.find(d => d.id === datasetId);
                      if (selectedDataset) {
                        newSchedules.push({
                          id: currentId++,
                          datasetCode: selectedDataset.code,
                          datasetName: selectedDataset.name,
                          categoryName: categoryName,
                          frequency: scheduleFormData.frequency,
                          startTime: scheduleFormData.startTime,
                          dataSource: scheduleFormData.dataSource,
                          status: 'active',
                          nextRun: '27/12/2024 ' + scheduleFormData.startTime,
                          createdBy: 'Nguyễn Văn A',
                          createdDate: '26/12/2024'
                        });
                      }
                    });

                    setSchedules([...schedules, ...newSchedules]);
                    setShowScheduleModal(false);
                    setSelectedCategoryIds(new Set());
                    setSelectedDatasetIds(new Set());
                    setScheduleFormData({
                      datasetId: '',
                      frequency: 'daily',
                      startTime: '08:00',
                      dataSource: ''
                    });
                    alert(`Đã thiết lập lịch công bố tự động cho ${newSchedules.length} dataset thành công!`);
                  }}
                  className={`px-4 py-2 rounded-lg ${selectedDatasetIds.size === 0 || !scheduleFormData.dataSource
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  disabled={selectedDatasetIds.size === 0 || !scheduleFormData.dataSource}
                >
                  Lưu lịch ({selectedDatasetIds.size} dataset)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Schedule Modal */}
      {showDeleteScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Xác nhận xóa lịch</h2>
            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Bạn có chắc chắn muốn xóa lịch công bố tự động sau?
              </p>
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div>
                  <span className="text-xs text-slate-600">Dataset:</span>
                  <p className="text-sm text-slate-900">{selectedSchedule.datasetCode} - {selectedSchedule.datasetName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Tần suất:</span>
                  <p className="text-sm text-slate-900">
                    {selectedSchedule.frequency === 'daily' && 'Hàng ngày'}
                    {selectedSchedule.frequency === 'weekly' && 'Hàng tuần'}
                    {selectedSchedule.frequency === 'monthly' && 'Hàng tháng'}
                    {selectedSchedule.frequency === 'quarterly' && 'Hàng quý'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteScheduleModal(false);
                  setSelectedSchedule(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
                  setShowDeleteScheduleModal(false);
                  setSelectedSchedule(null);
                  alert('Đã xóa lịch công bố tự động!');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa lịch
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Restore Version Modal */}
      {showRestoreModal && selectedVersionToRestore && selectedDatasetForVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-0 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-orange-50 border-b border-orange-100 p-4">
               <h2 className="text-orange-800 font-bold text-lg flex items-center gap-2">
                 <RotateCcw className="w-5 h-5" /> Xác nhận khôi phục
               </h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Bạn có chắc chắn muốn khôi phục tập dữ liệu về phiên bản cũ này? Phiên bản hiện tại sẽ đẩy vào lịch sử.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 mb-6">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                   <FileText className="w-4 h-4 text-emerald-600" />
                   <span className="text-sm font-medium text-slate-800">{selectedDatasetForVersion.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                   <div>
                     <span className="text-slate-500 text-xs block mb-1">Phiên bản sẽ khôi phục</span>
                     <span className="font-bold text-orange-600 px-2 py-0.5 bg-orange-100 rounded">{selectedVersionToRestore.version}</span>
                   </div>
                   <div>
                     <span className="text-slate-500 text-xs block mb-1">Ngày tạo bản cũ này</span>
                     <span className="text-slate-800 font-medium">{selectedVersionToRestore.updatedDate}</span>
                   </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRestoreModal(false);
                    setSelectedVersionToRestore(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowRestoreModal(false);
                    setSelectedVersionToRestore(null);
                    alert(`Đã khôi phục thành công ${selectedDatasetForVersion.name} về phiên bản ${selectedVersionToRestore.version}!`);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Xác nhận khôi phục
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