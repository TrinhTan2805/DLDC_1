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
  Trash2,
  X,
  Save,
  Database,
  List,
  Tag,
  Columns
} from 'lucide-react';

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'standard' | 'reference' | 'system';
  status: 'active' | 'inactive';
  createdDate: string;
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

export function CategorySetupPageNew() {
  const [activeTab, setActiveTab] = useState<'setup' | 'approval' | 'publish' | 'report' | 'stats'>('setup');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showFieldFormModal, setShowFieldFormModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryFields, setNewCategoryFields] = useState<CategoryField[]>([]);
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

  // Mock data
  const [categories] = useState<Category[]>([
    {
      id: '1',
      code: 'CAT001',
      name: 'Biên tập danh mục A',
      description: 'Danh mục quản lý thông tin A',
      type: 'standard',
      status: 'active',
      createdDate: '01/01/2024',
      fields: [
        { id: 'f1', name: 'Mã', dataType: 'TEXT', required: true },
        { id: 'f2', name: 'Tên', dataType: 'TEXT', required: true },
        { id: 'f3', name: 'Mô tả', dataType: 'TEXT', required: false }
      ]
    },
    {
      id: '2',
      code: 'CAT002',
      name: 'Danh mục B',
      description: 'Danh mục quản lý thông tin B',
      type: 'reference',
      status: 'active',
      createdDate: '15/02/2024',
      fields: [
        { id: 'f1', name: 'Mã', dataType: 'TEXT', required: true },
        { id: 'f2', name: 'Tên', dataType: 'TEXT', required: true }
      ]
    },
    {
      id: '3',
      code: 'CAT003',
      name: 'Danh mục C',
      description: 'Danh mục quản lý thông tin C',
      type: 'system',
      status: 'inactive',
      createdDate: '20/03/2024',
      fields: [
        { id: 'f1', name: 'Mã', dataType: 'TEXT', required: true },
        { id: 'f2', name: 'Tên', dataType: 'TEXT', required: true }
      ]
    }
  ]);

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    standard: categories.filter(c => c.type === 'standard').length,
    reference: categories.filter(c => c.type === 'reference').length
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || cat.type === filterType;
    const matchesStatus = filterStatus === 'all' || cat.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Hoạt động</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-full">Ngừng hoạt động</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl text-slate-900 mb-2">Thiết lập danh mục dùng chung</h2>
        <p className="text-slate-600 text-sm">
          Quản lý cấu hình và thiết lập các danh mục dữ liệu trong hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'setup'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Settings className="w-4 h-4" />
            Thiết lập
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'approval'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Phê duyệt
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'publish'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Globe className="w-4 h-4" />
            Công khai
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'report'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <FileText className="w-4 h-4" />
            Báo cáo và tìm kiếm
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'stats'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            Thu thập số liệu thống kê
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Tổng danh mục</p>
                      <p className="text-2xl text-blue-900">{stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Đang hoạt động</p>
                      <p className="text-2xl text-green-900">{stats.active}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Danh mục tiêu chuẩn</p>
                      <p className="text-2xl text-purple-900">{stats.standard}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                      <List className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-pink-700">Danh mục tham chiếu</p>
                      <p className="text-2xl text-pink-900">{stats.reference}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg text-slate-900">Thiết lập danh mục dùng chung</h3>
                  <p className="text-sm text-slate-600">Quản lý cấu hình và thiết lập các danh mục dữ liệu trong hệ thống</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm danh mục mới
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mã danh mục..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    title="Lọc loại"
                    value={filterType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="reference">Tham chiếu</option>
                    <option value="system">Hệ thống</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    title="Lọc trạng thái"
                    value={filterStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã danh mục</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên danh mục</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((category, index) => (
                        <tr key={category.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">{index + 1}</td>
                          <td className="px-6 py-4 text-sm">
                            <code className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {category.code}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{category.name}</div>
                            <div className="text-xs text-slate-500">{category.description}</div>
                          </td>
                          <td className="px-6 py-4">{getTypeBadge(category.type)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{category.createdDate}</td>
                          <td className="px-6 py-4">{getStatusBadge(category.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowDetailModal(true);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowAddFieldModal(true);
                                }}
                                className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                title="Thêm cột mới"
                              >
                                <Columns className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
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
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="text-center py-12 text-slate-500">
              Chức năng phê duyệt đang được phát triển
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="text-center py-12 text-slate-500">
              Chức năng công khai đang được phát triển
            </div>
          )}

          {activeTab === 'report' && (
            <div className="text-center py-12 text-slate-500">
              Chức năng báo cáo và tìm kiếm đang được phát triển
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="text-center py-12 text-slate-500">
              Chức năng thu thập số liệu thống kê đang được phát triển
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm danh mục mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Mã danh mục *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã danh mục"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Tên danh mục *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên danh mục"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả về danh mục..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Loại danh mục *</label>
                  <select
                    title="Loại danh mục"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn loại</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="reference">Tham chiếu</option>
                    <option value="system">Hệ thống</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Trạng thái *</label>
                  <select
                    title="Trạng thái"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Fields Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm text-slate-900">Cấu trúc trường dữ liệu</h4>
                  <button
                    onClick={() => {
                      setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                      setEditingFieldIndex(null);
                      setFieldErrors({});
                      setShowFieldFormModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm trường
                  </button>
                </div>

                {newCategoryFields.length > 0 && (
                  <div className="space-y-2">
                    {newCategoryFields.map((field, index) => (
                      <div key={field.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-slate-900">{field.name || '(Chưa đặt tên)'}</span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{field.dataType}</span>
                              {field.isPrimaryKey && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">🔑 Khóa chính</span>
                              )}
                              {field.isForeignKey && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">🔗 Khóa ngoại</span>
                              )}
                              {field.required && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Bắt buộc</span>
                              )}
                            </div>
                            {field.description && (
                              <p className="text-xs text-slate-500">{field.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              {field.maxLength && <span>Độ dài tối đa: {field.maxLength}</span>}
                              {field.defaultValue && <span>Giá trị mặc định: {field.defaultValue}</span>}
                              {field.isForeignKey && field.referenceTable && (
                                <span>Tham chiếu: {field.referenceTable}.{field.referenceField}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setNewFieldData({
                                  name: field.name,
                                  dataType: field.dataType,
                                  required: field.required,
                                  defaultValue: field.defaultValue || '',
                                  maxLength: field.maxLength || 255,
                                  description: field.description || '',
                                  isPrimaryKey: field.isPrimaryKey || false,
                                  isForeignKey: field.isForeignKey || false,
                                  referenceTable: field.referenceTable || '',
                                  referenceField: field.referenceField || ''
                                });
                                setEditingFieldIndex(index);
                                setFieldErrors({});
                                setShowFieldFormModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setNewCategoryFields(newCategoryFields.filter((_, i) => i !== index));
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Xóa trường"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {newCategoryFields.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p>Chưa có trường nào. Nhấn "Thêm trường" để bắt đầu.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Chi tiết danh mục: {selectedCategory.name}</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCategory(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Mã danh mục</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900">
                      {selectedCategory.code}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Tên danh mục</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900">
                      {selectedCategory.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Loại</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm">
                      {getTypeBadge(selectedCategory.type)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Trạng thái</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm">
                      {getStatusBadge(selectedCategory.status)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Mô tả</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900">
                      {selectedCategory.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fields Structure */}
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Cấu trúc trường dữ liệu</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-2 text-left text-xs text-slate-600 uppercase">STT</th>
                        <th className="px-4 py-2 text-left text-xs text-slate-600 uppercase">Tên trường</th>
                        <th className="px-4 py-2 text-left text-xs text-slate-600 uppercase">Kiểu dữ liệu</th>
                        <th className="px-4 py-2 text-left text-xs text-slate-600 uppercase">Bắt buộc</th>
                        <th className="px-4 py-2 text-left text-xs text-slate-600 uppercase">Giá trị mặc định</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategory.fields.map((field, index) => (
                        <tr key={field.id} className="border-b border-slate-100">
                          <td className="px-4 py-2 text-sm text-slate-900">{index + 1}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{field.name}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {field.dataType}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {field.required ? (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Có</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">Không</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-600">
                            {field.defaultValue || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="text-slate-400 hover:text-slate-600"
                title="Đóng"
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
                    title="Bắt buộc"
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
                    value={newFieldData.defaultValue || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giá trị mặc định"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
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

      {/* Field Form Modal — nested inside Add Modal, requires higher z-index per rule 5.4 */}
      {showFieldFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
              <button
                onClick={() => setShowFieldFormModal(false)}
                className="text-slate-400 hover:text-slate-600"
                title="Đóng"
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
                    title="Bắt buộc"
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
    </div>
  );
}