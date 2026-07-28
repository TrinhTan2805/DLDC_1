import { useState } from 'react';
import { Plus, Search, Settings, Eye, Edit, Trash2, CheckSquare, Share2, FileSearch, BarChart3, Filter, List } from 'lucide-react';

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  dataType: 'standard' | 'reference' | 'system';
  parentCategory?: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

interface ApprovalRequest {
  id: string;
  categoryCode: string;
  categoryName: string;
  requestType: 'create' | 'update' | 'delete';
  requester: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
}

export interface PublishedCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  publishDate: string;
  downloads: number;
  views: number;
  status: 'public' | 'private';
}

const mockCategories: Category[] = [
  {
    id: '1',
    code: 'ODCAT001',
    name: 'Biên tập danh mục A',
    description: 'Danh mục dữ liệu mở A',
    dataType: 'standard',
    isActive: true,
    createdDate: '01/01/2024',
    updatedDate: '10/12/2024'
  },
  {
    id: '2',
    code: 'ODCAT002',
    name: 'Danh mục B',
    description: 'Danh mục dữ liệu mở B',
    dataType: 'reference',
    isActive: true,
    createdDate: '15/02/2024',
    updatedDate: '08/12/2024'
  },
  {
    id: '3',
    code: 'ODCAT003',
    name: 'Danh mục C',
    description: 'Danh mục dữ liệu mở C',
    dataType: 'system',
    isActive: false,
    createdDate: '20/03/2024',
    updatedDate: '05/12/2024'
  },
];

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    categoryCode: 'ODCAT004',
    categoryName: 'Danh mục D',
    requestType: 'create',
    requester: 'Nguyễn Văn A',
    requestDate: '12/12/2024',
    status: 'pending',
    description: 'Yêu cầu tạo mới danh mục dữ liệu mở D'
  },
  {
    id: '2',
    categoryCode: 'ODCAT001',
    categoryName: 'Biên tập danh mục A',
    requestType: 'update',
    requester: 'Trần Thị B',
    requestDate: '10/12/2024',
    status: 'approved',
    description: 'Cập nhật mô tả danh mục dữ liệu mở A'
  },
  {
    id: '3',
    categoryCode: 'ODCAT005',
    categoryName: 'Danh mục E',
    requestType: 'create',
    requester: 'Lê Văn C',
    requestDate: '08/12/2024',
    status: 'rejected',
    description: 'Yêu cầu tạo danh mục E không hợp lệ'
  },
];

export const mockPublishedCategories: PublishedCategory[] = [
  {
    id: '1',
    code: 'ODCAT001',
    name: 'Biên tập danh mục A',
    description: 'Danh mục dữ liệu mở A',
    publishDate: '01/11/2024',
    downloads: 2456,
    views: 8920,
    status: 'public'
  },
  {
    id: '2',
    code: 'ODCAT002',
    name: 'Danh mục B',
    description: 'Danh mục dữ liệu mở B',
    publishDate: '15/10/2024',
    downloads: 1543,
    views: 5640,
    status: 'public'
  },
  {
    id: '3',
    code: 'ODCAT006',
    name: 'Danh mục F',
    description: 'Danh mục dữ liệu mở F',
    publishDate: '20/09/2024',
    downloads: 456,
    views: 1987,
    status: 'private'
  },
];

export function OpenDataCategorySetupPage() {
  const [activeTab, setActiveTab] = useState<'setup' | 'approval' | 'publish' | 'report' | 'statistics'>('setup');
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [approvalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [publishedCategories] = useState<PublishedCategory[]>(mockPublishedCategories);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Approval tab filters
  const [approvalFilterStatus, setApprovalFilterStatus] = useState<string>('all');
  const [approvalFilterType, setApprovalFilterType] = useState<string>('all');

  // Publish tab filters
  const [publishFilterStatus, setPublishFilterStatus] = useState<string>('all');

  // Filter logic for Setup tab
  const filteredCategories = categories.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? cat.isActive : !cat.isActive);
    const matchType = filterType === 'all' || cat.dataType === filterType;
    return matchSearch && matchStatus && matchType;
  });

  // Filter logic for Approval tab
  const filteredApprovalRequests = approvalRequests.filter(req => {
    const matchStatus = approvalFilterStatus === 'all' || req.status === approvalFilterStatus;
    const matchType = approvalFilterType === 'all' || req.requestType === approvalFilterType;
    return matchStatus && matchType;
  });

  // Filter logic for Publish tab
  const filteredPublishedCategories = publishedCategories.filter(cat => {
    const matchStatus = publishFilterStatus === 'all' || cat.status === publishFilterStatus;
    return matchStatus;
  });

  // Handle stats card click for Setup tab
  const handleStatsClick = (type: string) => {
    if (type === 'all') {
      setFilterStatus('all');
      setFilterType('all');
    } else if (type === 'active' || type === 'inactive') {
      setFilterStatus(type);
      setFilterType('all');
    } else {
      setFilterType(type);
      setFilterStatus('all');
    }
  };

  // Handle stats card click for Approval tab
  const handleApprovalStatsClick = (status: string) => {
    setApprovalFilterStatus(status);
    setApprovalFilterType('all');
  };

  // Handle stats card click for Publish tab
  const handlePublishStatsClick = (status: string) => {
    setPublishFilterStatus(status);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
        Hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
        Ngừng hoạt động
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      standard: 'bg-blue-100 text-blue-700 border-blue-200',
      reference: 'bg-amber-100 text-amber-700 border-amber-200',
      system: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    const labels = {
      standard: 'Chuẩn',
      reference: 'Tham chiếu',
      system: 'Hệ thống'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getApprovalStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getRequestTypeBadge = (type: string) => {
    const styles = {
      create: 'bg-blue-100 text-blue-700 border-blue-200',
      update: 'bg-amber-100 text-amber-700 border-amber-200',
      delete: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      create: 'Tạo mới',
      update: 'Cập nhật',
      delete: 'Xóa'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getPublishStatusBadge = (status: string) => {
    return status === 'public' ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
        Công khai
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
        Riêng tư
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'setup'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Settings className="w-4 h-4" />
            Thiết lập
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'approval'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <CheckSquare className="w-4 h-4" />
            Phê duyệt
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'publish'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Share2 className="w-4 h-4" />
            Công khai danh mục
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'report'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <FileSearch className="w-4 h-4" />
            Báo cáo và tìm kiếm
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'statistics'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            Thu thập số liệu thống kê
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab 1: Thiết lập */}
          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-900">Thiết lập danh mục dữ liệu mở</h2>
                  <p className="text-sm text-slate-600 mt-1">Quản lý cấu hình và thiết lập các danh mục dữ liệu mở</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm danh mục mới
                </button>
              </div>

              {/* Stats - Clickable */}
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => handleStatsClick('all')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-emerald-300 ${filterStatus === 'all' && filterType === 'all' ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <List className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Tổng danh mục</div>
                      <div className="text-slate-900 mt-1">{categories.length}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleStatsClick('active')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-green-300 ${filterStatus === 'active' ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Đang hoạt động</div>
                      <div className="text-slate-900 mt-1">{categories.filter(c => c.isActive).length}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleStatsClick('standard')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-blue-300 ${filterType === 'standard' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Danh mục chuẩn</div>
                      <div className="text-slate-900 mt-1">{categories.filter(c => c.dataType === 'standard').length}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleStatsClick('reference')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-amber-300 ${filterType === 'reference' ? 'ring-2 ring-amber-500 bg-amber-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Danh mục tham chiếu</div>
                      <div className="text-slate-900 mt-1">{categories.filter(c => c.dataType === 'reference').length}</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                      >
                        <option value="all">Tất cả loại</option>
                        <option value="standard">Chuẩn</option>
                        <option value="reference">Tham chiếu</option>
                        <option value="system">Hệ thống</option>
                      </select>
                    </div>
                  </div>
                </div>
                {(filterStatus !== 'all' || filterType !== 'all' || searchTerm) && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <span>Đang lọc: {filteredCategories.length} / {categories.length} danh mục</span>
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterType('all');
                        setSearchTerm('');
                      }}
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>

              {/* Category List */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày cập nhật</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, index) => (
                          <tr key={category.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">
                              <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                                {category.code}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-slate-900">{category.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{category.description}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">{getTypeBadge(category.dataType)}</td>
                            <td className="px-4 py-3 text-sm">{getStatusBadge(category.isActive)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{category.updatedDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Chỉnh sửa">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                            Không tìm thấy danh mục phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Phê duyệt */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-slate-900">Phê duyệt danh mục dữ liệu mở</h2>
                <p className="text-sm text-slate-600 mt-1">Trình và phê duyệt các yêu cầu thay đổi danh mục dữ liệu mở</p>
              </div>

              {/* Stats - Clickable */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleApprovalStatsClick('pending')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-yellow-300 ${approvalFilterStatus === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Chờ duyệt</div>
                      <div className="text-slate-900 mt-1">{approvalRequests.filter(r => r.status === 'pending').length}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleApprovalStatsClick('approved')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-green-300 ${approvalFilterStatus === 'approved' ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Đã duyệt</div>
                      <div className="text-slate-900 mt-1">{approvalRequests.filter(r => r.status === 'approved').length}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleApprovalStatsClick('rejected')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-red-300 ${approvalFilterStatus === 'rejected' ? 'ring-2 ring-red-500 bg-red-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Từ chối</div>
                      <div className="text-slate-900 mt-1">{approvalRequests.filter(r => r.status === 'rejected').length}</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Filter */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={approvalFilterStatus}
                        onChange={(e) => setApprovalFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={approvalFilterType}
                        onChange={(e) => setApprovalFilterType(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                      >
                        <option value="all">Tất cả loại yêu cầu</option>
                        <option value="create">Tạo mới</option>
                        <option value="update">Cập nhật</option>
                        <option value="delete">Xóa</option>
                      </select>
                    </div>
                  </div>
                </div>
                {(approvalFilterStatus !== 'all' || approvalFilterType !== 'all') && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <span>Đang lọc: {filteredApprovalRequests.length} / {approvalRequests.length} yêu cầu</span>
                    <button
                      onClick={() => {
                        setApprovalFilterStatus('all');
                        setApprovalFilterType('all');
                      }}
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>

              {/* Approval Requests Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại yêu cầu</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người yêu cầu</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày yêu cầu</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApprovalRequests.length > 0 ? (
                        filteredApprovalRequests.map((request, index) => (
                          <tr key={request.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">
                              <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                                {request.categoryCode}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">{request.categoryName}</td>
                            <td className="px-4 py-3 text-sm">{getRequestTypeBadge(request.requestType)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{request.requester}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{request.requestDate}</td>
                            <td className="px-4 py-3 text-sm">{getApprovalStatusBadge(request.status)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Chỉnh sửa">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                            Không tìm thấy yêu cầu phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Công khai danh mục */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-slate-900">Công khai danh mục dữ liệu mở</h2>
                <p className="text-sm text-slate-600 mt-1">Quản lý công khai và chia sẻ các danh mục dữ liệu mở</p>
              </div>

              {/* Stats - Clickable */}
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => handlePublishStatsClick('all')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-emerald-300 ${publishFilterStatus === 'all' ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Tổng đã công khai</div>
                      <div className="text-slate-900 mt-1">{publishedCategories.length}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handlePublishStatsClick('public')}
                  className={`bg-slate-50 border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-green-300 ${publishFilterStatus === 'public' ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Đang công khai</div>
                      <div className="text-slate-900 mt-1">{publishedCategories.filter(c => c.status === 'public').length}</div>
                    </div>
                  </div>
                </button>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Tổng lượt xem</div>
                      <div className="text-slate-900 mt-1">{publishedCategories.reduce((sum, c) => sum + c.views, 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileSearch className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Tổng lượt tải</div>
                      <div className="text-slate-900 mt-1">{publishedCategories.reduce((sum, c) => sum + c.downloads, 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={publishFilterStatus}
                        onChange={(e) => setPublishFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                      </select>
                    </div>
                  </div>
                </div>
                {publishFilterStatus !== 'all' && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <span>Đang lọc: {filteredPublishedCategories.length} / {publishedCategories.length} danh mục</span>
                    <button
                      onClick={() => setPublishFilterStatus('all')}
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>

              {/* Published Categories Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày công khai</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Lượt xem</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Lượt tải</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPublishedCategories.length > 0 ? (
                        filteredPublishedCategories.map((category, index) => (
                          <tr key={category.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">
                              <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                                {category.code}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">{category.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{category.publishDate}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{category.views.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{category.downloads.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">{getPublishStatusBadge(category.status)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Cài đặt">
                                  <Settings className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Gỡ công khai">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                            Không tìm thấy danh mục phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Báo cáo và tìm kiếm */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-slate-900">Báo cáo và tìm kiếm danh mục dữ liệu mở</h2>
                <p className="text-sm text-slate-600 mt-1">Tìm kiếm và xem báo cáo thống kê về các danh mục dữ liệu mở</p>
              </div>

              {/* Search Filters */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                <h3 className="text-sm text-slate-700">Bộ lọc tìm kiếm</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Từ khóa</label>
                    <input
                      type="text"
                      placeholder="Nhập từ khóa..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Loại danh mục</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Tất cả</option>
                      <option value="standard">Chuẩn</option>
                      <option value="reference">Tham chiếu</option>
                      <option value="system">Hệ thống</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Trạng thái</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Tất cả</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngừng hoạt động</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                    Xóa bộ lọc
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Report Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-slate-700">Danh mục theo loại</h3>
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Chuẩn</span>
                      <span className="text-slate-900">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tham chiếu</span>
                      <span className="text-slate-900">10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Hệ thống</span>
                      <span className="text-slate-900">7</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-slate-700">Trạng thái hoạt động</h3>
                    <Settings className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Hoạt động</span>
                      <span className="text-slate-900">25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Ngừng hoạt động</span>
                      <span className="text-slate-900">7</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-slate-700">Cập nhật gần đây</h3>
                    <FileSearch className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Hôm nay</span>
                      <span className="text-slate-900">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tuần này</span>
                      <span className="text-slate-900">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tháng này</span>
                      <span className="text-slate-900">32</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm text-slate-700 mb-4">Xuất báo cáo</h3>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Xuất Excel
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Xuất PDF
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Xuất CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Thu thập số liệu thống kê */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-slate-900">Thu thập số liệu thống kê danh mục dữ liệu mở</h2>
                <p className="text-sm text-slate-600 mt-1">Theo dõi và phân tích số liệu thống kê về các danh mục dữ liệu mở</p>
              </div>

              {/* Date Range Filter */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Từ ngày</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Đến ngày</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Loại thống kê</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="usage">Số lượt sử dụng</option>
                      <option value="changes">Số lần thay đổi</option>
                      <option value="access">Số lần truy cập</option>
                    </select>
                  </div>
                  <div>
                    <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                      Xem thống kê
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-2xl text-slate-900 mb-1">2,847</div>
                  <div className="text-xs text-slate-600">Tổng lượt sử dụng</div>
                  <div className="mt-2 text-xs text-green-600">+15.8% so với tháng trước</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl text-slate-900 mb-1">234</div>
                  <div className="text-xs text-slate-600">Số lần thay đổi</div>
                  <div className="mt-2 text-xs text-green-600">+11.2% so với tháng trước</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl text-slate-900 mb-1">6,542</div>
                  <div className="text-xs text-slate-600">Lượt truy cập</div>
                  <div className="mt-2 text-xs text-green-600">+22.4% so với tháng trước</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileSearch className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-2xl text-slate-900 mb-1">987</div>
                  <div className="text-xs text-slate-600">Lượt tìm kiếm</div>
                  <div className="mt-2 text-xs text-green-600">+8.7% so với tháng trước</div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm text-slate-700 mb-4">Top 5 danh mục dữ liệu mở được sử dụng nhiều nhất</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Biên tập danh mục A', count: 847, percentage: 92 },
                    { name: 'Danh mục B', count: 623, percentage: 78 },
                    { name: 'Danh mục C', count: 512, percentage: 65 },
                    { name: 'Danh mục D', count: 398, percentage: 52 },
                    { name: 'Danh mục E', count: 225, percentage: 35 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700">{item.name}</span>
                        <span className="text-sm text-slate-900">{item.count} lượt</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
