import { Building, Download, Plus, Search, Filter, Eye, PlayCircle, PauseCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { StatsCard } from '../../common/StatsCard';
import { DataDetailModal } from '../../DataDetailModal';

interface InternalSource {
  id: number;
  name: string;
  department: string;
  system: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastSync: string;
  totalRecords: number;
  frequency: string;
  contact: string;
}

const internalSources: InternalSource[] = [
  {
    id: 1,
    name: 'CSDL Công chứng',
    department: 'Cục Công chứng',
    system: 'HT Công chứng điện tử',
    type: 'Database',
    status: 'active',
    lastSync: '09/12/2025 14:45',
    totalRecords: 850000,
    frequency: 'Real-time',
    contact: 'congchung@moj.gov.vn'
  },
  {
    id: 2,
    name: 'CSDL Trợ giúp pháp lý',
    department: 'Cục Trợ giúp pháp lý',
    system: 'HT Quản lý TGPL',
    type: 'API',
    status: 'active',
    lastSync: '09/12/2025 14:30',
    totalRecords: 620000,
    frequency: 'Hàng ngày',
    contact: 'tgpl@moj.gov.vn'
  },
  {
    id: 3,
    name: 'CSDL Hộ tịch',
    department: 'Cục Hộ tịch, quốc tịch',
    system: 'HT Hộ tịch điện tử',
    type: 'Database',
    status: 'active',
    lastSync: '09/12/2025 14:15',
    totalRecords: 1500000,
    frequency: 'Real-time',
    contact: 'hotich@moj.gov.vn'
  },
  {
    id: 4,
    name: 'CSDL Thi hành án dân sự',
    department: 'Tổng cục Thi hành án',
    system: 'HT Quản lý THADS',
    type: 'Database',
    status: 'maintenance',
    lastSync: '08/12/2025 16:00',
    totalRecords: 950000,
    frequency: 'Hàng ngày',
    contact: 'thads@moj.gov.vn'
  },
  {
    id: 5,
    name: 'CSDL Văn bản QPPL',
    department: 'Vụ Pháp luật',
    system: 'HT Quản lý VBQPPL',
    type: 'API',
    status: 'active',
    lastSync: '09/12/2025 13:50',
    totalRecords: 350000,
    frequency: 'Hàng ngày',
    contact: 'vbqppl@moj.gov.vn'
  },
  {
    id: 6,
    name: 'CSDL Đăng ký giao dịch bảo đảm',
    department: 'Cục Đăng ký quốc gia',
    system: 'HT ĐKGDBD',
    type: 'Database',
    status: 'active',
    lastSync: '09/12/2025 14:40',
    totalRecords: 720000,
    frequency: 'Real-time',
    contact: 'dkgdbd@moj.gov.vn'
  },
  {
    id: 7,
    name: 'CSDL Giám định tư pháp',
    department: 'Cục Giám định tư pháp',
    system: 'HT Quản lý GDTP',
    type: 'Database',
    status: 'inactive',
    lastSync: '06/12/2025 09:30',
    totalRecords: 180000,
    frequency: 'Hàng tuần',
    contact: 'gdtp@moj.gov.vn'
  }
];

export function InternalDataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<InternalSource | null>(null);

  const filteredSources = internalSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.system.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || source.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs">Hoạt động</span>;
      case 'inactive':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs">Ngừng</span>;
      case 'maintenance':
        return <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Bảo trì</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'API': 'bg-blue-100 text-blue-700',
      'Database': 'bg-purple-100 text-purple-700'
    };
    return <span className={`px-2.5 py-1 ${colors[type as keyof typeof colors]} rounded-full text-xs`}>{type}</span>;
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      'Real-time': 'bg-green-100 text-green-700',
      'Hàng ngày': 'bg-blue-100 text-blue-700',
      'Hàng tuần': 'bg-yellow-100 text-yellow-700'
    };
    return <span className={`px-2.5 py-1 ${colors[frequency as keyof typeof colors]} rounded-full text-xs`}>{frequency}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-green-600" />
          <h2 className="text-slate-900 font-medium">Dữ liệu từ hệ thống trong ngành</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Building} iconColor="green" title="Tổng nguồn" value="15" />
        <StatsCard icon={PlayCircle} iconColor="green" title="Đang hoạt động" value="12" />
        <StatsCard icon={RefreshCw} iconColor="orange" title="Bảo trì" value="2" />
        <StatsCard icon={Download} iconColor="purple" title="Tổng bản ghi" value="5.17M" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm theo tên nguồn, đơn vị, hệ thống..."
                title="Tìm kiếm nguồn dữ liệu"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select aria-label="Select box"
              value={filterStatus}
              title="Lọc theo trạng thái"
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
          <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Thêm nguồn mới
          </button>
          <button 
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm"
            title="Lọc nâng cao"
          >
            <Filter className="w-4 h-4" />
            Lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-slate-900 font-medium text-sm text-slate-700">Danh sách nguồn dữ liệu ({filteredSources.length})</h3>
          <div className="flex items-center gap-2">
             <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Làm mới">
               <RefreshCw className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn dữ liệu</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đơn vị quản lý</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hệ thống</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số bản ghi</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tần suất</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đồng bộ cuối</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{source.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{source.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{source.system}</td>
                  <td className="px-6 py-4">{getTypeBadge(source.type)}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{source.totalRecords.toLocaleString()}</td>
                  <td className="px-6 py-4">{getFrequencyBadge(source.frequency)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono text-xs">{source.lastSync}</td>
                  <td className="px-6 py-4">{getStatusBadge(source.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedSource(source);
                          setIsDocModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Xem chi tiết hồ sơ nguồn"
                      >
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
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-lg">
          <div className="text-sm text-slate-600">
            Hiển thị {filteredSources.length} trong tổng số 15 nguồn
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-100 transition-colors disabled:opacity-50">Trước</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-100 transition-colors">Sau</button>
          </div>
        </div>
      </div>

      {/* Premium PDF Viewer Integration */}
      {isDocModalOpen && selectedSource && (
        <DataDetailModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          title={`Chi tiết nguồn dữ liệu: ${selectedSource.name}`}
          totalRecords={selectedSource.totalRecords}
          newRecords={0}
          updatedRecords={0}
          errorRecords={0}
        />
      )}
    </div>
  );
}
