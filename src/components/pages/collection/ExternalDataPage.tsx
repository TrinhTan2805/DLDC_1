import { Building2, Download, Plus, Search, Filter, Calendar, Eye, PlayCircle, PauseCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSources = externalSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || source.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-base font-medium">Hoạt động</span>;
      case 'inactive':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-base font-medium">Ngừng</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-base font-medium">Chờ xử lý</span>;
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
    return <span className={`px-2.5 py-1 ${colors[type as keyof typeof colors]} rounded-full text-base font-medium`}>{type}</span>;
  };

  const handleExport = () => {
    alert('Đang kết xuất danh sách nguồn dữ liệu ngoài ngành ra file Excel...');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base text-slate-900 font-bold uppercase tracking-tight">Dữ liệu từ Bộ ngành ngoài</h2>
          <p className="text-base text-slate-500 mt-1">Theo dõi và quản lý dữ liệu từ các Bộ, Ngành bên ngoài</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Building2} iconColor="blue" title="Tổng nguồn" value="12" />
        <StatsCard icon={PlayCircle} iconColor="green" title="Đang hoạt động" value="8" />
        <StatsCard icon={PauseCircle} iconColor="red" title="Ngừng hoạt động" value="2" />
        <StatsCard icon={Download} iconColor="purple" title="Tổng bản ghi" value="8.15M" />
      </div>

      {/* Toolbar - Separated */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input aria-label="Input field"
              type="text"
              placeholder="Tìm kiếm theo tên nguồn, Bộ ngành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
          <div className="w-48">
            <select aria-label="Select box"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-base shadow-sm font-medium">
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base text-slate-900 font-bold uppercase tracking-tight">Danh sách nguồn dữ liệu ({filteredSources.length})</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase tracking-tight">Nguồn dữ liệu</th>
                <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase tracking-tight">Bộ/Ngành</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-slate-500 uppercase tracking-tight">Loại kết nối</th>
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
                      <td className="px-6 py-4 text-base font-semibold text-slate-900">{source.name}</td>
                      <td className="px-6 py-4 text-base text-slate-700">{source.ministry}</td>
                      <td className="px-6 py-4 text-center">{getTypeBadge(source.type)}</td>
                      <td className="px-6 py-4 text-center text-base font-medium text-slate-900">{source.totalRecords.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-base text-slate-600">{source.frequency}</td>
                      <td className="px-6 py-4 text-center text-base text-slate-600 font-mono">{source.lastSync}</td>
                      <td className="px-6 py-4 text-center">{getStatusBadge(source.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem chi tiết">
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
                  <td colSpan={8} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Building2 className="w-10 h-10 opacity-20" />
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
              className="px-2 py-1 border border-slate-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                      ? 'bg-blue-600 border-blue-600 text-white'
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
    </div>
    </div>
  );
 }
