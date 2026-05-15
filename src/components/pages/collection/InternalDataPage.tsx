import { Building, Download, Plus, Search, Filter, Eye, PlayCircle, PauseCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-base font-medium">Hoạt động</span>;
      case 'inactive':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-base font-medium">Ngừng</span>;
      case 'maintenance':
        return <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-base font-medium">Bảo trì</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'API': 'bg-blue-100 text-blue-700',
      'Database': 'bg-purple-100 text-purple-700'
    };
    return <span className={`px-2.5 py-1 ${colors[type as keyof typeof colors]} rounded-full text-base font-medium`}>{type}</span>;
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      'Real-time': 'bg-green-100 text-green-700',
      'Hàng ngày': 'bg-blue-100 text-blue-700',
      'Hàng tuần': 'bg-yellow-100 text-yellow-700'
    };
    return <span className={`px-2.5 py-1 ${colors[frequency as keyof typeof colors]} rounded-full text-base font-medium`}>{frequency}</span>;
  };

  const handleExport = () => {
    alert('Đang kết xuất danh sách nguồn dữ liệu trong ngành ra file Excel...');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shadow-sm">
          <Building className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-base text-slate-900 font-bold uppercase tracking-tight">Dữ liệu từ hệ thống trong ngành</h2>
          <p className="text-base text-slate-500 mt-1">Theo dõi và quản lý dữ liệu từ các hệ thống nội bộ</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Building} iconColor="green" title="Tổng nguồn" value="15" />
        <StatsCard icon={PlayCircle} iconColor="green" title="Đang hoạt động" value="12" />
        <StatsCard icon={RefreshCw} iconColor="orange" title="Bảo trì" value="2" />
        <StatsCard icon={Download} iconColor="purple" title="Tổng bản ghi" value="5.17M" />
      </div>

      {/* Toolbar - Separated */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input aria-label="Input field"
              type="text"
              placeholder="Tìm kiếm theo tên nguồn, đơn vị, hệ thống..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
            />
          </div>
          <div className="w-48">
            <select aria-label="Select box"
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-base shadow-sm font-medium">
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base text-slate-900 font-bold uppercase tracking-tight">Danh sách nguồn dữ liệu ({filteredSources.length})</h3>
          <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Làm mới">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase tracking-tight">Nguồn dữ liệu</th>
                <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase tracking-tight">Đơn vị quản lý</th>
                <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase tracking-tight">Hệ thống</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-slate-500 uppercase tracking-tight">Loại</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-slate-500 uppercase tracking-tight">Số bản ghi</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-slate-500 uppercase tracking-tight">Tần suất</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-slate-500 uppercase tracking-tight">Đồng bộ cuối</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-slate-500 uppercase tracking-tight">Trạng thái</th>
                <th className="px-6 py-4 text-right text-base font-semibold text-slate-500 uppercase tracking-tight w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSources.length > 0 ? (
                filteredSources
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((source) => (
                    <tr key={source.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-base font-semibold text-slate-900">{source.name}</div>
                      </td>
                      <td className="px-6 py-4 text-base text-slate-700">{source.department}</td>
                      <td className="px-6 py-4 text-base text-slate-600">{source.system}</td>
                      <td className="px-6 py-4 text-center">{getTypeBadge(source.type)}</td>
                      <td className="px-6 py-4 text-center text-base font-medium text-slate-900">{source.totalRecords.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">{getFrequencyBadge(source.frequency)}</td>
                      <td className="px-6 py-4 text-center text-base text-slate-600 font-mono">{source.lastSync}</td>
                      <td className="px-6 py-4 text-center">{getStatusBadge(source.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setSelectedSource(source);
                              setIsDocModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Đồng bộ ngay">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Building className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-base font-medium text-slate-600">Không tìm thấy nguồn dữ liệu nào.</p>
                      <p className="text-base text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-white sticky bottom-0">
          <div className="flex items-center gap-2">
            <span className="text-base text-slate-600">Hiển thị</span>
            <select 
              className="px-2 py-1 border border-slate-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              title="Số bản ghi trên trang"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-base text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-base text-slate-600">
              {filteredSources.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredSources.length)} / {filteredSources.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-base font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredSources.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg text-base font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  const totalPages = Math.ceil(filteredSources.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredSources.length / itemsPerPage) || filteredSources.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-base font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
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
    </div>
  );
}
