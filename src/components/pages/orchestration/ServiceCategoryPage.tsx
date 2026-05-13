import { useState } from 'react';
import { Plus, Search, FolderOpen, Eye, Edit, Trash2, FileText, Server } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  serviceCount: number;
  parentCategory: string;
  status: 'active' | 'inactive';
  createdDate: string;
  updatedBy: string;
}

const mockCategories: ServiceCategory[] = [
  {
    id: '1',
    code: 'CAT001',
    name: 'Biên tập danh mục A',
    description: 'Nhóm các dịch vụ thuộc danh mục A',
    serviceCount: 12,
    parentCategory: '-',
    status: 'active',
    createdDate: '10/01/2024',
    updatedBy: 'Người dùng A'
  },
  {
    id: '2',
    code: 'CAT002',
    name: 'Danh mục B',
    description: 'Nhóm các dịch vụ thuộc danh mục B',
    serviceCount: 8,
    parentCategory: '-',
    status: 'active',
    createdDate: '15/01/2024',
    updatedBy: 'Người dùng B'
  },
  {
    id: '3',
    code: 'CAT003',
    name: 'Danh mục C',
    description: 'Nhóm các dịch vụ thuộc danh mục C',
    serviceCount: 6,
    parentCategory: '-',
    status: 'active',
    createdDate: '20/01/2024',
    updatedBy: 'Người dùng C'
  },
];

export function ServiceCategoryPage() {
  const [categories] = useState<ServiceCategory[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterParent, setFilterParent] = useState('all');

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cat.status === filterStatus;
    const matchesParent = filterParent === 'all' ||
      (filterParent === 'root' && cat.parentCategory === '-') ||
      (filterParent === 'child' && cat.parentCategory !== '-');
    return matchesSearch && matchesStatus && matchesParent;
  });

  const getStatusBadge = (status: string) => {
    return (
      <StatusTag 
        label={status === 'active' ? 'Đang sử dụng' : 'Ngừng sử dụng'} 
        variant={status === 'active' ? 'green' : 'slate'} 
      />
    );
  };

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    inactive: categories.filter(c => c.status === 'inactive').length,
    totalServices: categories.reduce((sum, c) => sum + c.serviceCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Danh mục dịch vụ</h1>
          <p className="text-sm text-slate-600 mt-1">Quản lý phân loại và nhóm các dịch vụ điều phối dữ liệu</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm danh mục mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng danh mục</div>
              <div className="text-slate-900 mt-1">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Đang sử dụng</div>
              <div className="text-slate-900 mt-1">{stats.active}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Ngừng sử dụng</div>
              <div className="text-slate-900 mt-1">{stats.inactive}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng dịch vụ</div>
              <div className="text-slate-900 mt-1">{stats.totalServices}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang sử dụng</option>
            <option value="inactive">Ngừng sử dụng</option>
          </select>
          <select
            value={filterParent}
            onChange={(e) => setFilterParent(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả cấp danh mục</option>
            <option value="root">Danh mục cha</option>
            <option value="child">Danh mục con</option>
          </select>
        </div>
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
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mô tả</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Danh mục cha</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số dịch vụ</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người cập nhật</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không tìm thấy danh mục phù hợp
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr key={category.id} className={`hover:bg-slate-50 ${category.parentCategory !== '-' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">
                        {category.code}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className={`w-4 h-4 ${category.parentCategory === '-' ? 'text-blue-600' : 'text-purple-600'}`} />
                        <span className="text-sm text-slate-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                      {category.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {category.parentCategory === '-' ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <span className="text-blue-700">{category.parentCategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {category.serviceCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(category.status)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{category.updatedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa">
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

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded"></div>
            <span className="text-blue-900">Danh mục cha</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-100 rounded"></div>
            <span className="text-blue-900">Danh mục con</span>
          </div>
        </div>
      </div>
    </div>
  );
}