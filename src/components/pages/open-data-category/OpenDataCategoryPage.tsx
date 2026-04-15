import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Upload, Filter, FileText, Info, Edit, CheckCircle, XCircle, Eye, Clock, FileCheck, Shield, History as HistoryIcon, File, ExternalLink } from 'lucide-react';

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
}

interface VersionHistoryItem {
  id: number;
  version: string;
  description: string;
  updatedBy: string;
  updatedDate: string;
  changes: string;
  status: string;
}

interface ScheduleItem {
  id: number;
  datasetCode: string;
  datasetName: string;
  categoryName?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startTime: string;
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
    id: 2,
    version: 'v1.2',
    description: 'Bổ sung metadata',
    updatedBy: 'Trần Thị B',
    updatedDate: '10/12/2024',
    changes: 'Cập nhật thông tin giấy phép',
    status: 'Lịch sử'
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
  const [activeTab, setActiveTab] = useState<'category' | 'version' | 'schedule'>('category');
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
  const [showBulkPublishModal, setShowBulkPublishModal] = useState(false);
  const [showBulkUnpublishModal, setShowBulkUnpublishModal] = useState(false);
  const [showBulkApprovalModal, setShowBulkApprovalModal] = useState(false);
  const [showSubmitApprovalModal, setShowSubmitApprovalModal] = useState(false);
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
    status: 'active' as 'active' | 'inactive'
  });

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
    dataSource: ''
  });

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

  return (
    <div className="h-full flex flex-col bg-slate-50">
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
            onClick={() => setActiveTab('version')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'version'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <HistoryIcon className="w-4 h-4" />
            Lịch sử thay đổi
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
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
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
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới
                  </button>
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
              {selectedIds.size > 0 && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-emerald-900">
                    Đã chọn <strong>{selectedIds.size}</strong> mục
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBulkPublishModal(true)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Công bố
                    </button>
                    <button
                      onClick={() => setShowBulkUnpublishModal(true)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Hủy công bố
                    </button>
                    <button
                      onClick={() => setShowBulkApprovalModal(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <FileCheck className="w-4 h-4" />
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>
              )}

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

                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Search className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-sm font-medium">Không tìm thấy giấy phép nào phù hợp</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Version History */}
        {activeTab === 'version' && (
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6">
              <h2 className="text-slate-900 mb-6">Lịch sử phiên bản</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-1/3">Phiên bản</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mô tả</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người cập nhật</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày cập nhật</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thay đổi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sampleVersionHistory.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">{item.version}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{item.updatedBy}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{item.updatedDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{item.changes}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {item.status === 'Hiện tại' ? (
                            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
                              Hiện tại
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                              Lịch sử
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
                                  setShowDeleteScheduleModal(true);
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Xóa"
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
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">Thêm mới {categoryName}</h2>
            <div className="space-y-4">
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
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Nhập mô tả..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    setFormData({ code: '', name: '', description: '', status: 'active' });
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
                    setFormData({ code: '', name: '', description: '', status: 'active' });
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
                    setFormData({ code: '', name: '', description: '', status: 'active' });
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

      {showMetadataModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] scale-in-center">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-emerald-600 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {selectedMetadata ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {selectedMetadata ? 'Chỉnh sửa' : 'Thêm mới'} Metadata
              </h2>
              <button
                onClick={() => setShowMetadataModal(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dataset selection - Full width in grid */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Tập dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all font-medium"
                    value={metadataFormData.datasetCode}
                    onChange={(e) => {
                      const selected = data.find(item => item.code === e.target.value);
                      setMetadataFormData({
                        ...metadataFormData,
                        datasetCode: e.target.value,
                        datasetName: selected?.name || ''
                      });
                    }}
                  >
                    <option value="">Chọn tập dữ liệu mở...</option>
                    {data.map(item => (
                      <option key={item.id} value={item.code}>{item.code} - {item.name}</option>
                    ))}
                  </select>
                </div>

                {/* Description - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Mô tả Metadata <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all text-sm min-h-[100px]"
                    placeholder="Nhập mô tả chi tiết cho tập dữ liệu này..."
                    value={metadataFormData.description}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, description: e.target.value })}
                  />
                </div>

                {/* Keywords - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-600" />
                    Từ khóa (cách nhau bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all"
                    placeholder="Ví dụ: văn bản, pháp luật, đất đai..."
                    value={metadataFormData.keywords}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, keywords: e.target.value })}
                  />
                </div>

                {/* License and Format */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Giấy phép <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all"
                    value={metadataFormData.licenseId}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, licenseId: Number(e.target.value) })}
                  >
                    {licenseEntries.map(license => (
                      <option key={license.id} value={license.id}>{license.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Định dạng dữ liệu
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all"
                    value={metadataFormData.format}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, format: e.target.value })}
                  >
                    <option value="CSV">CSV (Bảng)</option>
                    <option value="JSON">JSON (Cấu trúc)</option>
                    <option value="XML">XML</option>
                    <option value="API">API (Dịch vụ)</option>
                    <option value="RDF">RDF (Linked Data)</option>
                  </select>
                </div>

                {/* Source */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Nguồn dữ liệu / Hệ thống cung cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all"
                    placeholder="Ví dụ: Hệ thống thông tin pháp luật Bộ Tư pháp"
                    value={metadataFormData.source}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, source: e.target.value })}
                  />
                </div>

                {/* Frequency and Status */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Tần suất cập nhật
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all"
                    value={metadataFormData.frequency}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, frequency: e.target.value as MetadataItem['frequency'] })}
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Trạng thái hoạt động
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all"
                    value={metadataFormData.status}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, status: e.target.value as MetadataItem['status'] })}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ngừng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => saveMetadata(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center gap-2 shadow-sm"
                >
                  <FileCheck className="w-4 h-4" />
                  Lưu & Gửi Duyệt
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMetadataModal(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold"
                >
                  Hủy
                </button>
                <button
                  onClick={() => saveMetadata(false)}
                  className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-sm"
                >
                  Lưu tạm (Nháp)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLicenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">{selectedLicense ? 'Chỉnh sửa' : 'Thêm mới'} giấy phép</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên giấy phép <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={licenseFormData.name}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  value={licenseFormData.description}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Điều kiện sử dụng <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  value={licenseFormData.terms}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, terms: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Liên kết tham chiếu <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={licenseFormData.referenceUrl}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, referenceUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={licenseFormData.status}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, status: e.target.value as LicenseItem['status'] })}
                >
                  <option value="active">Còn hiệu lực</option>
                  <option value="inactive">Không hiệu lực</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowLicenseModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
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
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  rows={3}
                  value={selectedItem?.description}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
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
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Người cập nhật</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  value={selectedItem?.updatedBy}
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
                      setShowSubmitApprovalModal(true);
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
                      setShowApprovalModal(true);
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
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue={selectedItem?.code}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue={selectedItem?.name}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  defaultValue={selectedItem?.description}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue={selectedItem?.status}
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

      {/* Submit for Approval Modal */}
      {showSubmitApprovalModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-slate-900 mb-4">Gửi phê duyệt</h2>
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
                  Người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                >
                  <option value="">-- Chọn người phê duyệt --</option>
                  {approvers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Nội dung gửi kèm
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Nhập nội dung gửi kèm (không bắt buộc)..."
                  value={submitApprovalNote}
                  onChange={(e) => setSubmitApprovalNote(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSubmitApprovalModal(false);
                  setSelectedApprover('');
                  setSubmitApprovalNote('');
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!selectedApprover) {
                    alert('Vui lòng chọn người phê duyệt!');
                    return;
                  }
                  if (selectedItem) {
                    const approverName = approvers.find(a => a.id === selectedApprover)?.name || '';
                    setData(data.map(item =>
                      item.id === selectedItem.id
                        ? { ...item, approvalStatus: 'pending' as const }
                        : item
                    ));
                    alert(`Đã gửi yêu cầu phê duyệt thành công!\n\nNgười phê duyệt: ${approverName}${submitApprovalNote ? '\nNội dung: ' + submitApprovalNote : ''}`);
                  }
                  setShowSubmitApprovalModal(false);
                  setSelectedApprover('');
                  setSubmitApprovalNote('');
                  setSelectedItem(null);
                }}
                className={`px-4 py-2 rounded-lg ${!selectedApprover
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                disabled={!selectedApprover}
              >
                Gửi phê duyệt
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
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Nội dung phê duyệt
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  placeholder="Nhập nội dung phê duyệt (không bắt buộc)..."
                  value={approvalNote}
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
              {selectedSchedule ? 'Chi tiết lịch công bố' : 'Thêm lịch công bố tự động'}
            </h2>

            <div className="space-y-4">
              {/* Step 1: Select Categories */}
              {!selectedSchedule && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Bước 1: Chọn bảng danh mục <span className="text-red-500">*</span>
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

              {/* Step 2: Select Dataset */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  {selectedSchedule ? 'Dataset' : `Bước 2: Chọn dataset ${selectedCategoryIds.size > 0 ? '' : '(Chọn danh mục trước)'}`} <span className="text-red-500">*</span>
                </label>
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

              {/* Step 3: Frequency */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  {selectedSchedule ? 'Tần suất cập nhật' : 'Bước 3: Tần suất cập nhật'} <span className="text-red-500">*</span>
                </label>
                {selectedSchedule ? (
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
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, frequency: e.target.value as any })}
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần (Thứ 2 hàng tuần)</option>
                    <option value="monthly">Hàng tháng (Ngày 1 hàng tháng)</option>
                    <option value="quarterly">Hàng quý (Ngày 1 quý)</option>
                  </select>
                )}
              </div>

              {/* Step 4: Start Time */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  {selectedSchedule ? 'Thời gian bắt đầu' : 'Bước 4: Thời gian bắt đầu'} <span className="text-red-500">*</span>
                </label>
                {selectedSchedule ? (
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-900">
                    {selectedSchedule.startTime}
                  </div>
                ) : (
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={scheduleFormData.startTime}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                  />
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Thời gian hệ thống sẽ tự động chạy tác vụ
                </p>
              </div>

              {/* Step 5: Data Source */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  {selectedSchedule ? 'Nguồn dữ liệu' : 'Bước 5: Nguồn dữ liệu'} <span className="text-red-500">*</span>
                </label>
                {selectedSchedule ? (
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

              {selectedSchedule && (
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
                  setSelectedCategoryIds(new Set());
                  setSelectedDatasetIds(new Set());
                  setScheduleFormData({
                    datasetId: '',
                    frequency: 'daily',
                    startTime: '08:00',
                    dataSource: ''
                  });
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                {selectedSchedule ? 'Đóng' : 'Hủy'}
              </button>
              {!selectedSchedule && (
                <button
                  onClick={() => {
                    if (selectedDatasetIds.size === 0 || !scheduleFormData.dataSource) {
                      alert('Vui lòng chọn ít nhất 1 dataset và nhập nguồn dữ liệu!');
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
    </div>
  );
}