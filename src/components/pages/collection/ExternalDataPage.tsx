import { Building2, Download, Plus, Search, Filter, Calendar, Eye, PlayCircle, PauseCircle } from 'lucide-react';
import { useState } from 'react';
import { StatsCard } from '../../common/StatsCard';

interface DataSource {
  id: number;
  name: string;
  ministry: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  lastSync: string;
  totalRecords: number;
  frequency: string;
  contact: string;
}

const externalSources: DataSource[] = [
  {
    id: 1,
    name: 'CSDL Đăng ký doanh nghiệp',
    ministry: 'Bộ Kế hoạch và Đầu tư',
    type: 'API',
    status: 'active',
    lastSync: '09/12/2025 14:30',
    totalRecords: 1250000,
    frequency: 'Hàng ngày',
    contact: 'api.dkkd@mpi.gov.vn'
  },
  {
    id: 2,
    name: 'CSDL Bảo hiểm xã hội',
    ministry: 'Bảo hiểm xã hội Việt Nam',
    type: 'Database',
    status: 'active',
    lastSync: '09/12/2025 12:15',
    totalRecords: 3500000,
    frequency: 'Hàng tuần',
    contact: 'data@vss.gov.vn'
  },
  {
    id: 3,
    name: 'CSDL Đất đai',
    ministry: 'Bộ Tài nguyên và Môi trường',
    type: 'File Transfer',
    status: 'pending',
    lastSync: '08/12/2025 16:45',
    totalRecords: 850000,
    frequency: 'Hàng tháng',
    contact: 'datdat@monre.gov.vn'
  },
  {
    id: 4,
    name: 'CSDL Thuế',
    ministry: 'Tổng cục Thuế',
    type: 'API',
    status: 'active',
    lastSync: '09/12/2025 13:00',
    totalRecords: 2100000,
    frequency: 'Hàng ngày',
    contact: 'api.tax@gdt.gov.vn'
  },
  {
    id: 5,
    name: 'CSDL Hải quan',
    ministry: 'Tổng cục Hải quan',
    type: 'Database',
    status: 'inactive',
    lastSync: '05/12/2025 10:20',
    totalRecords: 450000,
    frequency: 'Hàng ngày',
    contact: 'data@customs.gov.vn'
  }
];

export function ExternalDataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSources = externalSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || source.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs">Hoạt động</span>;
      case 'inactive':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs">Ngừng</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Chờ xử lý</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'API': 'bg-blue-100 text-blue-700',
      'Database': 'bg-purple-100 text-purple-700',
      'File Transfer': 'bg-orange-100 text-orange-700'
    };
    return <span className={`px-2.5 py-1 ${colors[type as keyof typeof colors]} rounded-full text-xs`}>{type}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-slate-900">Dữ liệu từ Bộ ngành ngoài</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Building2} iconColor="blue" title="Tổng nguồn" value="12" />
        <StatsCard icon={PlayCircle} iconColor="green" title="Đang hoạt động" value="8" />
        <StatsCard icon={PauseCircle} iconColor="red" title="Ngừng hoạt động" value="2" />
        <StatsCard icon={Download} iconColor="purple" title="Tổng bản ghi" value="8.15M" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm theo tên nguồn, Bộ ngành..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select aria-label="Select box"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>
          <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Thêm nguồn mới
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Danh sách nguồn dữ liệu ({filteredSources.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn dữ liệu</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Bộ/Ngành</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại kết nối</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số bản ghi</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tần suất</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đồng bộ cuối</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{source.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{source.ministry}</td>
                  <td className="px-6 py-4">{getTypeBadge(source.type)}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{source.totalRecords.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{source.frequency}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{source.lastSync}</td>
                  <td className="px-6 py-4">{getStatusBadge(source.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Đồng bộ ngay">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Hiển thị {filteredSources.length} trong tổng số 12 nguồn
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">Trước</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
