import { useState } from 'react';
import { 
  Globe, 
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
  Upload,
  Share2
} from 'lucide-react';
import { StatusTag } from '../common/StatusTag';

interface OpenDataCategory {
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
  downloadCount?: number;
  apiEndpoint?: string;
  updateFrequency?: string;
  format?: string;
}

const initialOpenDataCategories: OpenDataCategory[] = [
  {
    id: '1',
    code: 'OPEN_A',
    name: 'Danh mục Mở A',
    description: 'Mô tả danh mục mở A',
    dataType: 'Loại A',
    managingUnit: 'Đơn vị A',
    status: 'published',
    createdBy: 'Người dùng A',
    createdDate: '2024-01-10',
    approvedBy: 'Quản lý A',
    approvedDate: '2024-01-15',
    isPublished: true,
    publishedDate: '2024-01-20',
    publishedBy: 'Lãnh đạo A',
    shareScope: 'public',
    downloadCount: 1250,
    apiEndpoint: 'https://api.moj.gov.vn/open-data/v1/category-a',
    updateFrequency: 'Hằng ngày',
    format: 'JSON, XML, CSV'
  },
  {
    id: '2',
    code: 'OPEN_B',
    name: 'Danh mục Mở B',
    description: 'Mô tả danh mục mở B',
    dataType: 'Loại B',
    managingUnit: 'Đơn vị B',
    status: 'approved',
    createdBy: 'Người dùng B',
    createdDate: '2024-02-05',
    approvedBy: 'Quản lý B',
    approvedDate: '2024-02-10',
    proposedForPublish: true,
    proposedPublishDate: '2024-03-01',
    proposedPublishBy: 'Người dùng B',
    apiEndpoint: 'https://api.moj.gov.vn/open-data/v1/category-b',
    updateFrequency: 'Hằng tháng',
    format: 'JSON, Excel'
  },
  {
    id: '3',
    code: 'OPEN_C',
    name: 'Danh mục Mở C',
    description: 'Mô tả danh mục mở C',
    dataType: 'Loại C',
    managingUnit: 'Đơn vị C',
    status: 'pending',
    createdBy: 'Người dùng C',
    createdDate: '2024-02-20',
    apiEndpoint: 'https://api.moj.gov.vn/open-data/v1/category-c',
    updateFrequency: 'Hằng quý',
    format: 'JSON, CSV'
  },
];

export function OpenDataCategoryPage() {
  const [currentTab, setCurrentTab] = useState<'setup' | 'approval' | 'report' | 'publish' | 'statistics'>('report');
  const [categories, setCategories] = useState<OpenDataCategory[]>(initialOpenDataCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<OpenDataCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<OpenDataCategory | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedStatCard, setSelectedStatCard] = useState<string>('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [categoryToApprove, setCategoryToApprove] = useState<OpenDataCategory | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [categoryToPublish, setCategoryToPublish] = useState<OpenDataCategory | null>(null);
  const [publishShareScope, setPublishShareScope] = useState<'internal' | 'extended' | 'public'>('public');

  const approvers = [
    { id: '1', name: 'Trần Thị B', position: 'Trưởng phòng Quản lý dữ liệu', department: 'Cục CNTT' },
    { id: '2', name: 'Nguyễn Văn D', position: 'Phó Cục trưởng', department: 'Cục CNTT' },
    { id: '3', name: 'Lê Thị E', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
    { id: '4', name: 'Phạm Văn F', position: 'Cục trưởng', department: 'Cục CNTT' },
  ];

  const [advancedSearchForm, setAdvancedSearchForm] = useState({
    code: '',
    name: '',
    description: '',
    dataType: '',
    managingUnit: '',
    status: '',
    shareScope: '',
    createdDateFrom: '',
    createdDateTo: '',
  });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    dataType: '',
    managingUnit: '',
    apiEndpoint: '',
    updateFrequency: '',
    format: '',
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

  const shareScopeLabels = {
    internal: 'Nội bộ',
    extended: 'Mở rộng',
    public: 'Toàn dân'
  };

  // Filter categories
  const filteredCategories = categories.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchAdvCode = !advancedSearchForm.code || 
                        cat.code.toLowerCase().includes(advancedSearchForm.code.toLowerCase());
    const matchAdvName = !advancedSearchForm.name || 
                        cat.name.toLowerCase().includes(advancedSearchForm.name.toLowerCase());
    const matchAdvDesc = !advancedSearchForm.description || 
                        cat.description.toLowerCase().includes(advancedSearchForm.description.toLowerCase());
    const matchAdvDataType = !advancedSearchForm.dataType || cat.dataType === advancedSearchForm.dataType;
    const matchAdvUnit = !advancedSearchForm.managingUnit || cat.managingUnit === advancedSearchForm.managingUnit;
    const matchAdvStatus = !advancedSearchForm.status || cat.status === advancedSearchForm.status;
    const matchAdvShareScope = !advancedSearchForm.shareScope || cat.shareScope === advancedSearchForm.shareScope;
    
    const matchAdvDateFrom = !advancedSearchForm.createdDateFrom || 
                            cat.createdDate >= advancedSearchForm.createdDateFrom;
    const matchAdvDateTo = !advancedSearchForm.createdDateTo || 
                          cat.createdDate <= advancedSearchForm.createdDateTo;
    
    const matchAdvanced = matchAdvCode && matchAdvName && matchAdvDesc && matchAdvDataType && 
                         matchAdvUnit && matchAdvStatus && matchAdvShareScope && matchAdvDateFrom && matchAdvDateTo;
    
    const matchStatus = statusFilter === 'all' || cat.status === statusFilter;
    
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
      shareScope: '',
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
      shareScope: '',
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
    totalDownloads: categories.reduce((sum, c) => sum + (c.downloadCount || 0), 0),
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
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      const newCategory: OpenDataCategory = {
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
    setFormData({ code: '', name: '', description: '', dataType: '', managingUnit: '', apiEndpoint: '', updateFrequency: '', format: '' });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const handleEdit = (category: OpenDataCategory) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description,
      dataType: category.dataType,
      managingUnit: category.managingUnit,
      apiEndpoint: category.apiEndpoint || '',
      updateFrequency: category.updateFrequency || '',
      format: category.format || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.status === 'approved' || category?.status === 'published') {
      alert('Không thể xóa danh mục đã được phê duyệt hoặc công bố');
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
    if (confirm('Phê duyệt danh mục dữ liệu mở này?')) {
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
      alert('Đã phê duyệt danh mục dữ liệu mở');
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

  const handlePublishCategory = (category: OpenDataCategory) => {
    setCategoryToPublish(category);
    setPublishShareScope('public');
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

    alert('Đã gửi đề xuất công bố danh mục dữ liệu mở thành công!');
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
            proposedForPublish: false,
            downloadCount: 0
          } 
        : cat
    ));

    alert(`Đã công bố danh mục dữ liệu mở "${categoryToPublish.name}" với phạm vi: ${shareScopeLabels[publishShareScope]}`);
    
    setShowPublishModal(false);
    setCategoryToPublish(null);
    setPublishShareScope('public');
  };

  const handleExportReport = () => {
    alert('Xuất báo cáo danh mục dữ liệu mở (chức năng đang phát triển)');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1">
        <button
          onClick={() => setCurrentTab('setup')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'setup'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Thiết lập danh mục
        </button>
        <button
          onClick={() => setCurrentTab('approval')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors relative ${
            currentTab === 'approval'
              ? 'bg-emerald-600 text-white'
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
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Công bố dữ liệu mở
        </button>
        <button
          onClick={() => setCurrentTab('report')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'report'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Báo cáo & Tìm kiếm
        </button>
        <button
          onClick={() => setCurrentTab('statistics')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'statistics'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Thu thập số liệu thống kê
        </button>
      </div>

      {/* Setup Tab */}
      {currentTab === 'setup' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục dữ liệu mở..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tạo danh mục mới
            </button>
          </div>

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
                          variant={category.status === 'published' ? 'indigo' : category.status === 'approved' ? 'green' : category.status === 'pending' ? 'amber' : category.status === 'rejected' ? 'red' : 'slate'}
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục chờ phê duyệt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{category.name}</h3>
                      <StatusTag label="Chờ phê duyệt" variant="amber" />
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
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
                      <div>
                        <span className="text-slate-500">Ngày tạo:</span>
                        <span className="ml-2 text-slate-900">{category.createdDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setViewingCategory(category)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleReject(category.id)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(category.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Phê duyệt
                  </button>
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">Không có danh mục nào cần phê duyệt</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Tab - Show categories ready for publishing */}
      {currentTab === 'publish' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đã công bố</span>
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.published}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Chờ công bố</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.proposedForPublish}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng lượt tải</span>
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalDownloads.toLocaleString()}</div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {categories.filter(c => c.status === 'approved' || c.status === 'published').filter(cat => 
              cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cat.code.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((category) => (
              <div key={category.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{category.name}</h3>
                      {category.isPublished ? (
                        <StatusTag 
                          label={`Đã công bố - ${shareScopeLabels[category.shareScope || 'internal']}`} 
                          variant="emerald" 
                          icon={<Globe className="w-3 h-3" />} 
                        />
                      ) : category.proposedForPublish ? (
                        <StatusTag label="Đề xuất công bố" variant="amber" />
                      ) : (
                        <StatusTag label="Sẵn sàng công bố" variant="blue" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Mã:</span>
                        <span className="ml-2 text-slate-900 font-mono">{category.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Tần suất:</span>
                        <span className="ml-2 text-slate-900">{category.updateFrequency || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Định dạng:</span>
                        <span className="ml-2 text-slate-900">{category.format || 'N/A'}</span>
                      </div>
                      {category.isPublished && (
                        <div>
                          <span className="text-slate-500">Lượt tải:</span>
                          <span className="ml-2 text-slate-900">{category.downloadCount?.toLocaleString() || 0}</span>
                        </div>
                      )}
                    </div>
                    {category.apiEndpoint && (
                      <div className="mt-3 p-2 bg-slate-50 rounded text-xs font-mono text-slate-700">
                        API: {category.apiEndpoint}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  {!category.isPublished && !category.proposedForPublish && (
                    <button
                      onClick={() => handleProposePublish(category.id)}
                      className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      Đề xuất công bố
                    </button>
                  )}
                  {!category.isPublished && (
                    <button
                      onClick={() => handlePublishCategory(category)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Công bố dữ liệu mở
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Tab */}
      {currentTab === 'report' && (
        <div className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => handleStatCardClick('all')}
              className={`bg-white border rounded-lg p-4 text-left hover:shadow-md transition-all ${
                selectedStatCard === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng số danh mục</span>
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.total}</div>
            </button>

            <button
              onClick={() => handleStatCardClick('approved')}
              className={`bg-white border rounded-lg p-4 text-left hover:shadow-md transition-all ${
                selectedStatCard === 'approved' ? 'border-green-500 ring-2 ring-green-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đã phê duyệt</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.approved}</div>
            </button>

            <button
              onClick={() => handleStatCardClick('pending')}
              className={`bg-white border rounded-lg p-4 text-left hover:shadow-md transition-all ${
                selectedStatCard === 'pending' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Chờ phê duyệt</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.pending}</div>
            </button>

            <button
              onClick={() => handleStatCardClick('published')}
              className={`bg-white border rounded-lg p-4 text-left hover:shadow-md transition-all ${
                selectedStatCard === 'published' ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đã công bố</span>
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.published}</div>
              <div className="text-xs text-slate-500 mt-1">{stats.totalDownloads.toLocaleString()} lượt tải</div>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục dữ liệu mở..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Tìm kiếm nâng cao
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Xuất báo cáo
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
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Loại dữ liệu</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Đơn vị quản lý</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Phạm vi chia sẻ</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Lượt tải</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 font-mono">{category.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{category.dataType}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{category.managingUnit}</td>
                      <td className="px-4 py-3">
                        <StatusTag 
                          label={statusLabels[category.status]} 
                          variant={category.status === 'published' ? 'indigo' : category.status === 'approved' ? 'green' : category.status === 'pending' ? 'amber' : category.status === 'rejected' ? 'red' : 'slate'} 
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {category.shareScope ? shareScopeLabels[category.shareScope] : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {category.downloadCount ? category.downloadCount.toLocaleString() : '-'}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
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

      {/* Statistics Collection Tab */}
      {currentTab === 'statistics' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Thu thập số liệu thống kê trọng Phần mềm thống kê liên thống kế trọng lĩnh vực Tư do liệu mở theo Quyết định số ...</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {[
                'Thu thập số liệu thống kê trong lĩnh vực văn bản quy phạm pháp luật theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực kiểm tra văn bản quy phạm pháp luật theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Phổ biến, giáo dục pháp luật theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Hòa giải ở cơ sở theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Trọng giải viên theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Công chứng theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Hộ tịch theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Quốc tịch theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Chứng thực theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Lý lịch tư pháp theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Trợ giúp pháp lý theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Đăng ký giao dịch bảo đảm theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Tư vấn pháp luật theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Bán đấu giá tài sản theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Giám định tư pháp theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Hành nghề luật sư theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Đăng ký, giao dịch về quyền sử dụng đất theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Trợ giúp pháp lý theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Đấu giá quyền sử dụng đất theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Hành nghề Công chứng theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Thi hành án dân sự theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Bồi thường nhà nước theo Thông tư quy định về báo cáo thống kê',
                'Chuẩn tiếp cận pháp luật theo Thông tư quy định chi tiết một số điều của Nghị định về quản lý danh mục cơ sở dữ liệu chuyên ngành',
                'Thu thập số liệu thống kê trong lĩnh vực Đăng ký biện pháp bảo đảm theo Thông tư quy định về báo cáo thống kê',
                'Thu thập số liệu thống kê trong lĩnh vực Tư vấn pháp luật đại diện theo Thông tư quy định về báo cáo thống kê',
                'Quản lý danh mục cơ sở dữ liệu chuyên ngành theo Thông tư quy định'
              ].map((item, index) => (
                <div key={index} className="px-6 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-700">
                  {index + 1}. {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <h2 className="text-slate-900">
                {editingCategory ? 'Chỉnh sửa danh mục dữ liệu mở' : 'Tạo danh mục dữ liệu mở mới'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Mã danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="VD: OPEN_VBQPPL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Loại dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">-- Chọn loại --</option>
                    <option value="Chuẩn">Chuẩn</option>
                    <option value="Tham chiếu">Tham chiếu</option>
                    <option value="Nội bộ">Nội bộ</option>
                    <option value="Danh mục">Danh mục</option>
                    <option value="Thống kê">Thống kê</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="VD: Dữ liệu mở - Văn bản QPPL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Mô tả chi tiết về danh mục dữ liệu mở..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Đơn vị quản lý <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.managingUnit}
                  onChange={(e) => setFormData({ ...formData, managingUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Chọn đơn vị --</option>
                  <option value="Đơn vị A">Đơn vị A</option>
                  <option value="Đơn vị B">Đơn vị B</option>
                  <option value="Đơn vị C">Đơn vị C</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật</label>
                  <select
                    value={formData.updateFrequency}
                    onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Chọn tần suất --</option>
                    <option value="Hằng ngày">Hằng ngày</option>
                    <option value="Hằng tuần">Hằng tuần</option>
                    <option value="Hằng tháng">Hằng tháng</option>
                    <option value="Hằng quý">Hằng quý</option>
                    <option value="Hằng năm">Hằng năm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Định dạng</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="VD: JSON, XML, CSV"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">API Endpoint</label>
                <input
                  type="text"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://api.moj.gov.vn/open-data/v1/..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <h2 className="text-slate-900">Chi tiết danh mục dữ liệu mở</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Mã danh mục</label>
                  <p className="text-slate-900 font-mono">{viewingCategory.code}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Trạng thái</label>
                  <StatusTag 
                    label={statusLabels[viewingCategory.status]} 
                    variant={viewingCategory.status === 'published' ? 'indigo' : viewingCategory.status === 'approved' ? 'green' : viewingCategory.status === 'pending' ? 'amber' : viewingCategory.status === 'rejected' ? 'red' : 'slate'} 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Tên danh mục</label>
                  <p className="text-slate-900">{viewingCategory.name}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Mô tả</label>
                  <p className="text-slate-900">{viewingCategory.description}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Loại dữ liệu</label>
                  <p className="text-slate-900">{viewingCategory.dataType}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Đơn vị quản lý</label>
                  <p className="text-slate-900">{viewingCategory.managingUnit}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Người tạo</label>
                  <p className="text-slate-900">{viewingCategory.createdBy}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Ngày tạo</label>
                  <p className="text-slate-900">{viewingCategory.createdDate}</p>
                </div>
                {viewingCategory.approvedBy && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Người phê duyệt</label>
                      <p className="text-slate-900">{viewingCategory.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Ngày phê duyệt</label>
                      <p className="text-slate-900">{viewingCategory.approvedDate}</p>
                    </div>
                  </>
                )}
                {viewingCategory.isPublished && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Phạm vi chia sẻ</label>
                      <p className="text-slate-900">{viewingCategory.shareScope ? shareScopeLabels[viewingCategory.shareScope] : '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Lượt tải xuống</label>
                      <p className="text-slate-900">{viewingCategory.downloadCount?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Người công bố</label>
                      <p className="text-slate-900">{viewingCategory.publishedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Ngày công bố</label>
                      <p className="text-slate-900">{viewingCategory.publishedDate}</p>
                    </div>
                  </>
                )}
                {viewingCategory.updateFrequency && (
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Tần suất cập nhật</label>
                    <p className="text-slate-900">{viewingCategory.updateFrequency}</p>
                  </div>
                )}
                {viewingCategory.format && (
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Định dạng</label>
                    <p className="text-slate-900">{viewingCategory.format}</p>
                  </div>
                )}
                {viewingCategory.apiEndpoint && (
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-500 mb-1">API Endpoint</label>
                    <p className="text-slate-900 font-mono text-sm bg-slate-50 p-2 rounded">{viewingCategory.apiEndpoint}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewingCategory(null)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
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
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-slate-900">Gửi yêu cầu phê duyệt</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Danh mục</label>
                <p className="text-slate-900">{categoryToApprove.name}</p>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Chọn người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn người phê duyệt --</option>
                  {approvers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.position} ({approver.department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Ghi chú</label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Ghi chú cho người phê duyệt..."
                />
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setCategoryToApprove(null);
                  setSelectedApprover('');
                  setApprovalNote('');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSendApproval}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && categoryToPublish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-slate-900">Công bố dữ liệu mở</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Danh mục</label>
                <p className="text-slate-900">{categoryToPublish.name}</p>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Phạm vi chia sẻ <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="shareScope"
                      value="internal"
                      checked={publishShareScope === 'internal'}
                      onChange={(e) => setPublishShareScope(e.target.value as any)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-slate-900">Nội bộ</div>
                      <div className="text-xs text-slate-500">Chỉ chia sẻ trong nội bộ cơ quan</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="shareScope"
                      value="extended"
                      checked={publishShareScope === 'extended'}
                      onChange={(e) => setPublishShareScope(e.target.value as any)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-slate-900">Mở rộng</div>
                      <div className="text-xs text-slate-500">Chia sẻ với các cơ quan liên quan</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="shareScope"
                      value="public"
                      checked={publishShareScope === 'public'}
                      onChange={(e) => setPublishShareScope(e.target.value as any)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-slate-900">Toàn dân</div>
                      <div className="text-xs text-slate-500">Công khai cho toàn xã hội</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setCategoryToPublish(null);
                  setPublishShareScope('public');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Công bố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-slate-900">Tìm kiếm nâng cao</h2>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mã danh mục</label>
                  <input
                    type="text"
                    value={advancedSearchForm.code}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tìm theo mã..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên danh mục</label>
                  <input
                    type="text"
                    value={advancedSearchForm.name}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tìm theo tên..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Loại dữ liệu</label>
                  <select
                    value={advancedSearchForm.dataType}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="Chuẩn">Chuẩn</option>
                    <option value="Tham chiếu">Tham chiếu</option>
                    <option value="Nội bộ">Nội bộ</option>
                    <option value="Danh mục">Danh mục</option>
                    <option value="Thống kê">Thống kê</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Đơn vị quản lý</label>
                  <select
                    value={advancedSearchForm.managingUnit}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, managingUnit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="Đơn vị A">Đơn vị A</option>
                    <option value="Đơn vị B">Đơn vị B</option>
                    <option value="Đơn vị C">Đơn vị C</option>
                    <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                    <option value="Cục Thi hành án dân sự">Cục Thi hành án dân sự</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                  <select
                    value={advancedSearchForm.status}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="draft">Nháp</option>
                    <option value="pending">Chờ phê duyệt</option>
                    <option value="approved">Đã phê duyệt</option>
                    <option value="rejected">Từ chối</option>
                    <option value="published">Đã công bố</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phạm vi chia sẻ</label>
                  <select
                    value={advancedSearchForm.shareScope}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, shareScope: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="internal">Nội bộ</option>
                    <option value="extended">Mở rộng</option>
                    <option value="public">Toàn dân</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Từ ngày</label>
                  <input
                    type="date"
                    value={advancedSearchForm.createdDateFrom}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, createdDateFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Đến ngày</label>
                  <input
                    type="date"
                    value={advancedSearchForm.createdDateTo}
                    onChange={(e) => setAdvancedSearchForm({ ...advancedSearchForm, createdDateTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={resetAdvancedSearch}
                className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAdvancedSearch}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
