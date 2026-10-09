import { useState, Fragment } from 'react';
import { Search, Plus, SquarePen, Trash2, Download, Upload, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface MasterDataDetailPageProps {
  categoryName: string;
  categoryId: string;
}

interface MasterDataItem {
  id: number;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  updatedBy: string;
}

const sampleData: MasterDataItem[] = [
  {
    id: 1,
    code: 'MD001',
    name: 'Bản ghi 1',
    description: 'Mô tả bản ghi dữ liệu chủ 1',
    status: 'active',
    createdDate: '15/12/2024',
    updatedBy: 'Nguyễn Văn A'
  },
  {
    id: 2,
    code: 'MD002',
    name: 'Bản ghi 2',
    description: 'Mô tả bản ghi dữ liệu chủ 2',
    status: 'active',
    createdDate: '14/12/2024',
    updatedBy: 'Trần Thị B'
  },
  {
    id: 3,
    code: 'MD003',
    name: 'Bản ghi 3',
    description: 'Mô tả bản ghi dữ liệu chủ 3',
    status: 'inactive',
    createdDate: '13/12/2024',
    updatedBy: 'Lê Văn C'
  }
];

export function MasterDataDetailPage({ categoryName, categoryId }: MasterDataDetailPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState<MasterDataItem[]>(sampleData);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleRowExpand = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Stats calculation
  const totalItems = data.length;
  const activeItems = data.filter(item => item.status === 'active').length;
  const inactiveItems = data.filter(item => item.status === 'inactive').length;

  const handleStatsClick = (filter: string) => {
    setStatusFilter(filter);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">{categoryName}</h1>
          <p className="text-sm text-slate-600 mt-1">Quản lý thông tin {categoryName.toLowerCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button 
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Statistics Cards - Clickable */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => handleStatsClick('all')}
          className={`bg-white border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-slate-300 ${
            statusFilter === 'all' ? 'ring-2 ring-slate-700 bg-slate-50' : ''
          }`}
        >
          <div className="text-sm text-slate-600">Tổng số bản ghi</div>
          <div className="text-slate-900 mt-1">{totalItems}</div>
        </button>
        <button
          onClick={() => handleStatsClick('active')}
          className={`bg-white border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-green-300 ${
            statusFilter === 'active' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
        >
          <div className="text-sm text-slate-600">Đang hoạt động</div>
          <div className="text-slate-900 mt-1">{activeItems}</div>
        </button>
        <button
          onClick={() => handleStatsClick('inactive')}
          className={`bg-white border border-slate-200 rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-red-300 ${
            statusFilter === 'inactive' ? 'ring-2 ring-red-500 bg-red-50' : ''
          }`}
        >
          <div className="text-sm text-slate-600">Ngừng hoạt động</div>
          <div className="text-slate-900 mt-1">{inactiveItems}</div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
              />
            </div>
          </div>
          <div className="w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-700 appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
        </div>
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <span>Đang lọc: {filteredData.length} / {data.length} bản ghi</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-slate-700 hover:text-slate-900 underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-12"></th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người cập nhật</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <Fragment key={item.id}>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRowExpand(item.id)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                          {item.code}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {item.status === 'active' ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                            Ngừng hoạt động
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.createdDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.updatedBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Chỉnh sửa">
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(item.id) && (
                      <tr className="bg-slate-50">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="text-sm">
                            <span className="text-slate-600">Mô tả:</span>{' '}
                            <span className="text-slate-900">{item.description}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}