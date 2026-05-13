import { useState } from 'react';
import { 
  FolderTree, 
  Plus,
  Search,
  Edit2,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
  AlertCircle,
  FileText,
  Database,
  Globe,
  Upload
} from 'lucide-react';
import { StatusTag } from '../common/StatusTag';

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  dataType: string;
  managingUnit: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  isPublished?: boolean;
  publishedDate?: string;
  publishedBy?: string;
  shareScope?: 'internal' | 'extended' | 'public';
  proposedForPublish?: boolean;
  proposedPublishDate?: string;
  proposedPublishBy?: string;
}

const initialCategories: Category[] = [
  {
    id: '1',
    code: 'DM_GIOI_TINH',
    name: 'Danh mục giới tính',
    description: 'Thư thập dữ liệu Danh mục giới tính',
    dataType: 'Chuẩn',
    managingUnit: 'Đơn vị A',
    status: 'approved',
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-01-10',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-15'
  },
  {
    id: '2',
    code: 'DM_DAN_TOC',
    name: 'Danh mục và mã các dân tộc',
    description: 'Thư thập dữ liệu Danh mục và mã các dân tộc',
    dataType: 'Chuẩn',
    managingUnit: 'Đơn vị B',
    status: 'approved',
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-01-12',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-17'
  },
  {
    id: '3',
    code: 'DM_QUOC_GIA',
    name: 'Danh mục và mã Quốc gia, Quốc tịch',
    description: 'Thư thập dữ liệu Danh mục và mã Quốc gia, Quốc tịch',
    dataType: 'Tham chiếu',
    managingUnit: 'Đơn vị C',
    status: 'pending',
    createdBy: 'Lê Văn C',
    createdDate: '2024-02-20'
  },
  {
    id: '4',
    code: 'DM_TON_GIAO',
    name: 'Danh mục và mã các Tôn giáo',
    description: 'Thư thập dữ liệu Danh mục và mã các Tôn giáo',
    dataType: 'Chuẩn',
    managingUnit: 'Đơn vị A',
    status: 'approved',
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-01-08',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-13'
  },
  {
    id: '5',
    code: 'DM_CO_QUAN',
    name: 'Danh mục cơ quan',
    description: 'Thư thập dữ liệu Danh mục cơ quan',
    dataType: 'Nội bộ',
    managingUnit: 'Vụ Tổ chức',
    status: 'pending',
    createdBy: 'Phạm Thị D',
    createdDate: '2024-02-15'
  },
  {
    id: '6',
    code: 'DM_DVHC',
    name: 'Danh mục đơn vị hành chính',
    description: 'Thư thập dữ liệu Danh mục đơn vị hành chính',
    dataType: 'Chuẩn',
    managingUnit: 'Đơn vị B',
    status: 'approved',
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-01-05',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-10'
  },
  {
    id: '7',
    code: 'DM_MOI_QUAN_HE',
    name: 'Danh mục và mã mối quan hệ trong gia đình',
    description: 'Thư thập dữ liệu Danh mục và mã mối quan hệ trong gia đình',
    dataType: 'Chuẩn',
    managingUnit: 'Đơn vị C',
    status: 'draft',
    createdBy: 'Hoàng Văn E',
    createdDate: '2024-03-01'
  },
  {
    id: '8',
    code: 'DM_GIAY_TO',
    name: 'Danh mục mã giấy tờ tùy thân',
    description: 'Thư thập dữ liệu Danh mục mã giấy tờ tùy thân',
    dataType: 'Chuẩn',
    managingUnit: 'Đơn vị A',
    status: 'approved',
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-01-20',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-25'
  },
];

export function CategoryManagementPage() {
  const [currentTab, setCurrentTab] = useState<'setup' | 'approval' | 'report' | 'publish'>('report');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedStatCard, setSelectedStatCard] = useState<string>('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [categoryToApprove, setCategoryToApprove] = useState<Category | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [showCategoryDataModal, setShowCategoryDataModal] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [categoryToPublish, setCategoryToPublish] = useState<Category | null>(null);
  const [publishShareScope, setPublishShareScope] = useState<'internal' | 'extended' | 'public'>('internal');

  const approvers = [
    { id: '1', name: 'Trần Thị B', position: 'Trưởng phòng Quản lý dữ liệu', department: 'Cục CNTT' },
    { id: '2', name: 'Nguyễn Văn D', position: 'Phó Cục trưởng', department: 'Cục CNTT' },
    { id: '3', name: 'Lê Thị E', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
    { id: '4', name: 'Phạm Văn F', position: 'Cục trưởng', department: 'Cục CNTT' },
  ];

  // Sample data for category values
  const getCategoryData = (code: string) => {
    const sampleData: Record<string, Array<{ id: string; code: string; name: string; description?: string }>> = {
      'DM_GIOI_TINH': [
        { id: '1', code: '1', name: 'Nam' },
        { id: '2', code: '2', name: 'Nữ' },
        { id: '3', code: '3', name: 'Khác' },
      ],
      'DM_DAN_TOC': [
        { id: '1', code: '01', name: 'Kinh' },
        { id: '2', code: '02', name: 'Tày' },
        { id: '3', code: '03', name: 'Thái' },
        { id: '4', code: '04', name: 'Hoa' },
        { id: '5', code: '05', name: 'Khmer' },
        { id: '6', code: '06', name: 'Mường' },
      ],
      'DM_QUOC_GIA': [
        { id: '1', code: 'VN', name: 'Việt Nam' },
        { id: '2', code: 'US', name: 'Hoa Kỳ' },
        { id: '3', code: 'CN', name: 'Trung Quốc' },
        { id: '4', code: 'JP', name: 'Nhật Bản' },
        { id: '5', code: 'KR', name: 'Hàn Quốc' },
      ],
      'DM_TON_GIAO': [
        { id: '1', code: '01', name: 'Phật giáo' },
        { id: '2', code: '02', name: 'Công giáo' },
        { id: '3', code: '03', name: 'Tin Lành' },
        { id: '4', code: '04', name: 'Hồi giáo' },
        { id: '5', code: '05', name: 'Không' },
      ],
      'DM_DVHC': [
        { id: '1', code: '01', name: 'Thành phố Hà Nội' },
        { id: '2', code: '79', name: 'Thành phố Hồ Chí Minh' },
        { id: '3', code: '48', name: 'Thành phố Đà Nẵng' },
        { id: '4', code: '92', name: 'Thành phố Cần Thơ' },
      ],
      'DM_GIAY_TO': [
        { id: '1', code: 'CMND', name: 'Chứng minh nhân dân' },
        { id: '2', code: 'CCCD', name: 'Căn cước công dân' },
        { id: '3', code: 'HC', name: 'Hộ chiếu' },
        { id: '4', code: 'GPLX', name: 'Giấy phép lái xe' },
      ],
    };
    return sampleData[code] || [];
  };

  const handleViewCategoryData = (category: Category) => {
    setSelectedCategoryData(category);
    setShowCategoryDataModal(true);
  };

  const [advancedSearchForm, setAdvancedSearchForm] = useState({
    code: '',
    name: '',
    description: '',
    dataType: '',
    managingUnit: '',
    status: '',
    createdDateFrom: '',
    createdDateTo: '',
  });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    dataType: '',
    managingUnit: '',
  });

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    published: 'bg-indigo-100 text-indigo-700',
  };

  const statusLabels = {
    draft: 'Nháp',
    pending: 'Chờ phê duyệt',
    approved: 'Đã phê duyệt',
    rejected: 'Từ chối',
    published: 'Đã công bố',
  };

  // Filter categories
  const filteredCategories = categories.filter(cat => {
    // Basic search
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Advanced search filters
    const matchAdvCode = !advancedSearchForm.code || 
                        cat.code.toLowerCase().includes(advancedSearchForm.code.toLowerCase());
    const matchAdvName = !advancedSearchForm.name || 
                        cat.name.toLowerCase().includes(advancedSearchForm.name.toLowerCase());
    const matchAdvDesc = !advancedSearchForm.description || 
                        cat.description.toLowerCase().includes(advancedSearchForm.description.toLowerCase());
    const matchAdvDataType = !advancedSearchForm.dataType || cat.dataType === advancedSearchForm.dataType;
    const matchAdvUnit = !advancedSearchForm.managingUnit || cat.managingUnit === advancedSearchForm.managingUnit;
    const matchAdvStatus = !advancedSearchForm.status || cat.status === advancedSearchForm.status;
    
    const matchAdvDateFrom = !advancedSearchForm.createdDateFrom || 
                            cat.createdDate >= advancedSearchForm.createdDateFrom;
    const matchAdvDateTo = !advancedSearchForm.createdDateTo || 
                          cat.createdDate <= advancedSearchForm.createdDateTo;
    
    const matchAdvanced = matchAdvCode && matchAdvName && matchAdvDesc && matchAdvDataType && 
                         matchAdvUnit && matchAdvStatus && matchAdvDateFrom && matchAdvDateTo;
    
    // Status filter for Setup tab
    const matchStatus = statusFilter === 'all' || cat.status === statusFilter;
    
    // Selected stat card filter (for Report tab)
    let matchStatCard = true;
    if (currentTab === 'report' && selectedStatCard !== 'all') {
      matchStatCard = cat.status === selectedStatCard;
    }
    
    if (currentTab === 'approval') {
      return matchSearch && cat.status === 'pending';
    }
    
    if (currentTab === 'report') {
      return matchSearch && matchAdvanced && matchStatCard;
    }
    
    return matchSearch && matchStatus;
  });

  const handleStatCardClick = (status: string) => {
    setSelectedStatCard(status);
    setSearchTerm('');
    setAdvancedSearchForm({
      code: '',
      name: '',
      description: '',
      dataType: '',
      managingUnit: '',
      status: '',
      createdDateFrom: '',
      createdDateTo: '',
    });
  };

  const handleAdvancedSearch = () => {
    setShowAdvancedSearch(false);
    setSelectedStatCard('all');
  };

  const resetAdvancedSearch = () => {
    setAdvancedSearchForm({
      code: '',
      name: '',
      description: '',
      dataType: '',
      managingUnit: '',
      status: '',
      createdDateFrom: '',
      createdDateTo: '',
    });
    setShowAdvancedSearch(false);
    setSelectedStatCard('all');
  };

  // Statistics for report
  const stats = {
    total: categories.length,
    approved: categories.filter(c => c.status === 'approved').length,
    pending: categories.filter(c => c.status === 'pending').length,
    draft: categories.filter(c => c.status === 'draft').length,
    rejected: categories.filter(c => c.status === 'rejected').length,
    published: categories.filter(c => c.status === 'published').length,
    proposedForPublish: categories.filter(c => c.proposedForPublish && !c.isPublished).length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.dataType || !formData.managingUnit) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (categories.some(cat => cat.code === formData.code && cat.id !== editingCategory?.id)) {
      alert('Mã danh mục đã tồn tại');
      return;
    }

    if (editingCategory) {
      // Update
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Create
      const newCategory: Category = {
        id: String(categories.length + 1),
        ...formData,
        status: 'draft',
        createdBy: 'Người dùng hiện tại',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setCategories([...categories, newCategory]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ code: '', name: '', description: '', dataType: '', managingUnit: '' });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description,
      dataType: category.dataType,
      managingUnit: category.managingUnit,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.status === 'approved') {
      alert('Không thể xóa danh mục đã được phê duyệt');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleSendApproval = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCategoryToApprove(category);
      setShowApprovalModal(true);
    }
  };

  const handleConfirmSendApproval = () => {
    if (!selectedApprover) {
      alert('Vui lòng chọn người phê duyệt');
      return;
    }

    if (!categoryToApprove) return;

    const approver = approvers.find(a => a.id === selectedApprover);
    
    setCategories(categories.map(cat => 
      cat.id === categoryToApprove.id ? { ...cat, status: 'pending' } : cat
    ));

    alert(`Đã gửi yêu cầu phê duyệt đến ${approver?.name} (${approver?.position})`);
    
    setShowApprovalModal(false);
    setCategoryToApprove(null);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleApprove = (id: string) => {
    if (confirm('Phê duyệt danh mục này?')) {
      setCategories(categories.map(cat => 
        cat.id === id 
          ? { 
              ...cat, 
              status: 'approved',
              approvedBy: 'Lãnh đạo hiện tại',
              approvedDate: new Date().toISOString().split('T')[0]
            } 
          : cat
      ));
      alert('Đã phê duyệt danh mục');
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      setCategories(categories.map(cat => 
        cat.id === id 
          ? { 
              ...cat, 
              status: 'rejected',
              rejectionReason: reason,
              approvedBy: 'Lãnh đạo hiện tại',
              approvedDate: new Date().toISOString().split('T')[0]
            } 
          : cat
      ));
      alert('Đã từ chối danh mục');
    }
  };

  const handleExportReport = () => {
    alert('Xuất báo cáo danh mục (chức năng đang phát triển)');
  };

  const handlePublishCategory = (category: Category) => {
    setCategoryToPublish(category);
    setPublishShareScope('internal');
    setShowPublishModal(true);
  };

  const handleProposePublish = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category || category.status !== 'approved') {
      alert('Chỉ có thể đề xuất công bố danh mục đã được phê duyệt');
      return;
    }

    if (category.proposedForPublish) {
      alert('Danh mục này đã được đề xuất công bố');
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            proposedForPublish: true,
            proposedPublishDate: new Date().toISOString().split('T')[0],
            proposedPublishBy: 'Người dùng hiện tại'
          } 
        : cat
    ));

    alert('Đã gửi đề xuất công bố danh mục thành công!');
  };

  const handleConfirmPublish = () => {
    if (!categoryToPublish) return;

    setCategories(categories.map(cat => 
      cat.id === categoryToPublish.id 
        ? { 
            ...cat, 
            status: 'published',
            isPublished: true,
            publishedDate: new Date().toISOString().split('T')[0],
            publishedBy: 'Lãnh đạo hiện tại',
            shareScope: publishShareScope,
            proposedForPublish: false
          } 
        : cat
    ));

    const scopeLabels = {
      internal: 'Nội bộ',
      extended: 'Mở rộng',
      public: 'Toàn dân'
    };

    alert(`Đã công bố danh mục "${categoryToPublish.name}" với phạm vi: ${scopeLabels[publishShareScope]}`);
    
    setShowPublishModal(false);
    setCategoryToPublish(null);
    setPublishShareScope('internal');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1">
        <button
          onClick={() => setCurrentTab('setup')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'setup'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Thiết lập danh mục
        </button>
        <button
          onClick={() => setCurrentTab('approval')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors relative ${
            currentTab === 'approval'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Phê duyệt danh mục
          {stats.pending > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {stats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab('publish')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'publish'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Công bố danh mục
        </button>
        <button
          onClick={() => setCurrentTab('report')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'report'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Báo cáo & Tìm kiếm
        </button>
      </div>

      {/* Setup Tab */}
      {currentTab === 'setup' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="pending">Chờ phê duyệt</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="rejected">Từ chối</option>
                <option value="published">Đã công bố</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tạo danh mục mới
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Mã danh mục</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Tên danh mục</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Loại dữ liệu</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Đơn vị quản lý</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 font-mono">{category.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{category.description}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{category.dataType}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{category.managingUnit}</td>
                      <td className="px-4 py-3">
                        <StatusTag 
                          label={statusLabels[category.status]} 
                          variant={category.status === 'approved' ? 'green' : category.status === 'pending' ? 'amber' : category.status === 'rejected' ? 'red' : category.status === 'published' ? 'indigo' : 'slate'}
                          icon={
                            <>
                              {category.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                              {category.status === 'pending' && <Clock className="w-3 h-3" />}
                              {category.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                            </>
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingCategory(category)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {category.status === 'draft' && (
                            <>
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleSendApproval(category.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Gửi phê duyệt"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        Không tìm thấy danh mục nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Approval Tab */}
      {currentTab === 'approval' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục chờ phê duyệt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Approval List */}
          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{category.name}</h3>
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Chờ phê duyệt
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Mã danh mục:</span>
                        <span className="ml-2 text-slate-900 font-mono">{category.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Loại dữ liệu:</span>
                        <span className="ml-2 text-slate-900">{category.dataType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Đơn vị quản lý:</span>
                        <span className="ml-2 text-slate-900">{category.managingUnit}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Người tạo:</span>
                        <span className="ml-2 text-slate-900">{category.createdBy}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Mô tả:</span>
                        <span className="ml-2 text-slate-900">{category.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleApprove(category.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Phê duyệt
                  </button>
                  <button
                    onClick={() => handleReject(category.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => setViewingCategory(category)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Không có danh mục nào đang chờ phê duyệt</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Tab */}
      {currentTab === 'publish' && (
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="mb-1">Chức năng công bố danh mục cho phép chia sẻ danh mục đã phê duyệt ra bên ngoài.</p>
              <p>Vui lòng kiểm tra kỹ trạng thái phê duyệt, phiên bản hiệu lực và quyền chủ sở hữu trước khi công bố.</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục đã phê duyệt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categories List */}
          <div className="space-y-3">
            {categories.filter(cat => (cat.status === 'approved' || cat.status === 'published') && (cat.proposedForPublish || cat.isPublished)).filter(cat => {
              const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 cat.code.toLowerCase().includes(searchTerm.toLowerCase());
              return matchSearch;
            }).map((category) => (
              <div key={category.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{category.name}</h3>
                      {category.status === 'published' ? (
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Đã công bố
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Đã phê duyệt
                        </span>
                      )}
                      {category.proposedForPublish && !category.isPublished && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          Đề xuất công bố
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Mã danh mục:</span>
                        <span className="ml-2 text-slate-900 font-mono">{category.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Loại dữ liệu:</span>
                        <span className="ml-2 text-slate-900">{category.dataType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Đơn vị quản lý:</span>
                        <span className="ml-2 text-slate-900">{category.managingUnit}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ngày phê duyệt:</span>
                        <span className="ml-2 text-slate-900">{category.approvedDate}</span>
                      </div>
                      {category.proposedForPublish && !category.isPublished && (
                        <>
                          <div>
                            <span className="text-slate-500">Người đề xuất:</span>
                            <span className="ml-2 text-slate-900">{category.proposedPublishBy}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Ngày đề xuất:</span>
                            <span className="ml-2 text-slate-900">{category.proposedPublishDate}</span>
                          </div>
                        </>
                      )}
                      {category.isPublished && (
                        <>
                          <div>
                            <span className="text-slate-500">Phạm vi chia sẻ:</span>
                            <span className="ml-2 text-slate-900">
                              {category.shareScope === 'internal' && 'Nội bộ'}
                              {category.shareScope === 'extended' && 'Mở rộng'}
                              {category.shareScope === 'public' && 'Toàn dân'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Ngày công bố:</span>
                            <span className="ml-2 text-slate-900">{category.publishedDate}</span>
                          </div>
                        </>
                      )}
                      <div className="col-span-2">
                        <span className="text-slate-500">Mô tả:</span>
                        <span className="ml-2 text-slate-900">{category.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  {!category.isPublished ? (
                    <>
                      <button
                        onClick={() => handlePublishCategory(category)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Công bố danh mục
                      </button>
                      <button
                        onClick={() => setViewingCategory(category)}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleViewCategoryData(category)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Database className="w-4 h-4" />
                        Xem dữ liệu
                      </button>
                      <button
                        onClick={() => setViewingCategory(category)}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                      <div className="text-sm text-slate-500 ml-auto">
                        Đã công bố vào {category.publishedDate}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {categories.filter(cat => (cat.status === 'approved' || cat.status === 'published') && (cat.proposedForPublish || cat.isPublished)).length === 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Chưa có danh mục nào được đề xuất công bố</p>
                <p className="text-slate-400 text-sm mt-2">Vui lòng đề xuất công bố danh mục đã phê duyệt từ tab Báo cáo & Tìm kiếm</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Tab */}
      {currentTab === 'report' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-6 gap-4">
            <button
              onClick={() => handleStatCardClick('all')}
              className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedStatCard === 'all' ? 'border-blue-500 shadow-md' : 'border-slate-200'
              }`}
            >
              <div className="text-slate-600 text-sm mb-1">Tổng danh mục</div>
              <div className="text-2xl text-slate-900">{stats.total}</div>
            </button>
            <button
              onClick={() => handleStatCardClick('approved')}
              className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedStatCard === 'approved' ? 'border-green-500 shadow-md' : 'border-green-200'
              }`}
            >
              <div className="text-green-600 text-sm mb-1">Đã phê duyệt</div>
              <div className="text-2xl text-green-700">{stats.approved}</div>
            </button>
            <button
              onClick={() => handleStatCardClick('pending')}
              className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedStatCard === 'pending' ? 'border-yellow-500 shadow-md' : 'border-yellow-200'
              }`}
            >
              <div className="text-yellow-600 text-sm mb-1">Chờ phê duyệt</div>
              <div className="text-2xl text-yellow-700">{stats.pending}</div>
            </button>
            <button
              onClick={() => handleStatCardClick('draft')}
              className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedStatCard === 'draft' ? 'border-slate-500 shadow-md' : 'border-slate-200'
              }`}
            >
              <div className="text-slate-600 text-sm mb-1">Nháp</div>
              <div className="text-2xl text-slate-700">{stats.draft}</div>
            </button>
            <button
              onClick={() => handleStatCardClick('rejected')}
              className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedStatCard === 'rejected' ? 'border-red-500 shadow-md' : 'border-red-200'
              }`}
            >
              <div className="text-red-600 text-sm mb-1">Từ chối</div>
              <div className="text-2xl text-red-700">{stats.rejected}</div>
            </button>
            <button
              onClick={() => handleStatCardClick('published')}
              className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedStatCard === 'published' ? 'border-indigo-500 shadow-md' : 'border-indigo-200'
              }`}
            >
              <div className="text-indigo-600 text-sm mb-1">Đã công bố</div>
              <div className="text-2xl text-indigo-700">{stats.published}</div>
            </button>
          </div>

          {/* Search and Export */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nâng cao theo tên, mã, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setShowAdvancedSearch(true)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                readOnly
              />
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Xuất báo cáo
            </button>
          </div>

          {/* Report Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Báo cáo thống kê danh sách danh mục
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Mã danh mục</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Tên danh mục</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Loại dữ liệu</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Đơn vị quản lý</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 font-mono">{category.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{category.description}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{category.dataType}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{category.managingUnit}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${statusColors[category.status]}`}>
                          {statusLabels[category.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewCategoryData(category)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Xem danh mục"
                          >
                            <Database className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewingCategory(category)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {category.status === 'draft' && (
                            <button
                              onClick={() => handleSendApproval(category.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Gửi phê duyệt"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {category.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(category.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Phê duyệt"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {category.status === 'approved' && !category.proposedForPublish && !category.isPublished && (
                            <button
                              onClick={() => handleProposePublish(category.id)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Đề xuất công bố"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                          {category.proposedForPublish && !category.isPublished && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded" title="Đã đề xuất công bố">
                              Đề xuất
                            </span>
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Mã danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="VD: DM_DVHC"
                  disabled={!!editingCategory}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Danh mục đơn vị hành chính"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Thư thập dữ liệu Danh mục..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Loại dữ liệu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn loại dữ liệu --</option>
                  <option value="Chuẩn">Chuẩn</option>
                  <option value="Tham chiếu">Tham chiếu</option>
                  <option value="Nội bộ">Nội bộ</option>
                  <option value="Chia sẻ">Chia sẻ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Đơn vị quản lý <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.managingUnit}
                  onChange={(e) => setFormData({ ...formData, managingUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn đơn vị quản lý --</option>
                  <option value="Đơn vị A">Đơn vị A</option>
                  <option value="Đơn vị B">Đơn vị B</option>
                  <option value="Đơn vị C">Đơn vị C</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Chi tiết danh mục</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Mã danh mục</div>
                  <div className="text-slate-900 font-mono">{viewingCategory.code}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Trạng thái</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${statusColors[viewingCategory.status]}`}>
                    {statusLabels[viewingCategory.status]}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Tên danh mục</div>
                <div className="text-slate-900">{viewingCategory.name}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Mô tả</div>
                <div className="text-slate-900">{viewingCategory.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Loại dữ liệu</div>
                  <div className="text-slate-900">{viewingCategory.dataType}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Đơn vị quản lý</div>
                  <div className="text-slate-900">{viewingCategory.managingUnit}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Người tạo</div>
                  <div className="text-slate-900">{viewingCategory.createdBy}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Ngày tạo</div>
                  <div className="text-slate-900">{viewingCategory.createdDate}</div>
                </div>
              </div>

              {viewingCategory.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Người phê duyệt</div>
                    <div className="text-slate-900">{viewingCategory.approvedBy}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Ngày phê duyệt</div>
                    <div className="text-slate-900">{viewingCategory.approvedDate}</div>
                  </div>
                </div>
              )}

              {viewingCategory.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm text-red-600 mb-1">Lý do từ chối</div>
                  <div className="text-red-900">{viewingCategory.rejectionReason}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewingCategory(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-slate-700">Tìm kiếm nâng cao cao Biên báo</h3>
              <button title="Hành động" aria-label="Hành động"
                onClick={resetAdvancedSearch}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {/* Tên tuyến */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Tên tuyến:</label>
                <select className="w-16 px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>=</option>
                  <option>{'≠'}</option>
                  <option>Chứa</option>
                </select>
                <input
                  type="text"
                  value={advancedSearchForm.name}
                  onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, name: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lý trình (km) */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Lý trình (km):</label>
                <div className="flex-1 px-3 py-1.5 text-sm text-slate-400">Chưa</div>
              </div>

              {/* Địa chỉ */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Địa chỉ:</label>
                <div className="flex-1 px-3 py-1.5 text-sm text-slate-400">Chưa</div>
              </div>

              {/* Phân loại */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Phân loại:</label>
                <select className="w-16 px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>=</option>
                  <option>{'≠'}</option>
                </select>
                <select 
                  value={advancedSearchForm.dataType}
                  onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, dataType: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="Chuẩn">Chuẩn</option>
                  <option value="Tham chiếu">Tham chiếu</option>
                  <option value="Nội bộ">Nội bộ</option>
                  <option value="Chia sẻ">Chia sẻ</option>
                </select>
              </div>

              {/* Tỉnh trạng */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Tỉnh trạng:</label>
                <select className="w-16 px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>=</option>
                  <option>{'≠'}</option>
                </select>
                <select 
                  value={advancedSearchForm.status}
                  onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, status: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="draft">Nháp</option>
                  <option value="pending">Chờ phê duyệt</option>
                  <option value="approved">Đã phê duyệt</option>
                  <option value="rejected">Từ chối</option>
                  <option value="published">Đã công bố</option>
                </select>
              </div>

              {/* Đơn vị quản lý */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Đơn vị quản lý:</label>
                <select className="w-16 px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>=</option>
                  <option>{'≠'}</option>
                </select>
                <select 
                  value={advancedSearchForm.managingUnit}
                  onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, managingUnit: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="Đơn vị A">Đơn vị A</option>
                  <option value="Đơn vị B">Đơn vị B</option>
                  <option value="Đơn vị C">Đơn vị C</option>
                </select>
              </div>

              {/* Người tạo */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Người tạo:</label>
                <div className="flex-1 px-3 py-1.5 text-sm text-slate-400">Chưa</div>
              </div>

              {/* Vị trí lập đặt */}
              <div className="flex items-center gap-3">
                <label className="w-32 text-sm text-slate-700 text-right">Vị trí lập đặt:</label>
                <select className="w-16 px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>=</option>
                  <option>{'≠'}</option>
                </select>
                <input
                  type="text"
                  value={advancedSearchForm.code}
                  onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, code: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleAdvancedSearch}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors text-sm"
              >
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={resetAdvancedSearch}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors text-sm"
              >
                Xóa điều kiện
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(false)}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && categoryToApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Gửi yêu cầu phê duyệt</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Mã danh mục</div>
                  <div className="text-slate-900 font-mono">{categoryToApprove.code}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Trạng thái</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${statusColors[categoryToApprove.status]}`}>
                    {statusLabels[categoryToApprove.status]}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Tên danh mục</div>
                <div className="text-slate-900">{categoryToApprove.name}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Mô tả</div>
                <div className="text-slate-900">{categoryToApprove.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Loại dữ liệu</div>
                  <div className="text-slate-900">{categoryToApprove.dataType}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Đơn vị quản lý</div>
                  <div className="text-slate-900">{categoryToApprove.managingUnit}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Người tạo</div>
                  <div className="text-slate-900">{categoryToApprove.createdBy}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Ngày tạo</div>
                  <div className="text-slate-900">{categoryToApprove.createdDate}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn người phê duyệt --</option>
                  {approvers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} ({approver.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Ghi chú phê duyệt
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Nhập ghi chú phê duyệt (nếu có)"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleConfirmSendApproval}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gửi yêu cầu phê duyệt
                </button>
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && categoryToPublish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900 flex items-center gap-2">
                <Globe className="w-6 h-6 text-indigo-600" />
                Công bố danh mục
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Xác nhận công bố danh mục ra cổng dữ liệu mở
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-900">
                  <p>Vui lòng kiểm tra kỹ các thông tin sau trước khi công bố:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Trạng thái phê duyệt: Đã được phê duyệt</li>
                    <li>Phiên bản hiệu lực: Đảm bảo là phiên bản mới nhất</li>
                    <li>Quyền chủ sở hữu: Xác nhận quyền công bố</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Mã danh mục</div>
                  <div className="text-slate-900 font-mono">{categoryToPublish.code}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Trạng thái</div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Đã phê duyệt
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Tên danh mục</div>
                <div className="text-slate-900">{categoryToPublish.name}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Mô tả</div>
                <div className="text-slate-900">{categoryToPublish.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Loại dữ liệu</div>
                  <div className="text-slate-900">{categoryToPublish.dataType}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Đơn vị quản lý</div>
                  <div className="text-slate-900">{categoryToPublish.managingUnit}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Người phê duyệt</div>
                  <div className="text-slate-900">{categoryToPublish.approvedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Ngày phê duyệt</div>
                  <div className="text-slate-900">{categoryToPublish.approvedDate}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm text-slate-700 mb-3">
                  Phạm vi chia sẻ <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="shareScope"
                      value="internal"
                      checked={publishShareScope === 'internal'}
                      onChange={(e) => setPublishShareScope(e.target.value as 'internal')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-slate-900">Nội bộ</div>
                      <div className="text-sm text-slate-600">Chỉ chia sẻ trong nội bộ cơ quan</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="shareScope"
                      value="extended"
                      checked={publishShareScope === 'extended'}
                      onChange={(e) => setPublishShareScope(e.target.value as 'extended')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-slate-900">Mở rộng</div>
                      <div className="text-sm text-slate-600">Chia sẻ với các cơ quan nhà nước khác</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="shareScope"
                      value="public"
                      checked={publishShareScope === 'public'}
                      onChange={(e) => setPublishShareScope(e.target.value as 'public')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-slate-900">Toàn dân</div>
                      <div className="text-sm text-slate-600">Công khai hoàn toàn trên cổng dữ liệu mở</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleConfirmPublish}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Xác nhận công bố
                </button>
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Data Modal */}
      {showCategoryDataModal && selectedCategoryData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg text-slate-900 flex items-center gap-2">
                    <Database className="w-6 h-6 text-indigo-600" />
                    Xem dữ liệu danh mục
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedCategoryData.name} ({selectedCategoryData.code})
                  </p>
                </div>
                <button
                  onClick={() => setShowCategoryDataModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Tổng số: <span className="text-slate-900">{getCategoryData(selectedCategoryData.code).length}</span> bản ghi
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Xuất dữ liệu
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Mã</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Tên</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {getCategoryData(selectedCategoryData.code).length > 0 ? (
                      getCategoryData(selectedCategoryData.code).map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-slate-900 font-mono">{item.code}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.description || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCategoryDataModal(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}