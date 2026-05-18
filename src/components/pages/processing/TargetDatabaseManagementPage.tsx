import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Database, Server, RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { TargetDatabaseModal } from './TargetDatabaseModal';
import { initialTargetDatabases, TargetDatabase } from './mockTargetDatabases';

export function TargetDatabaseManagementPage() {
  const [data, setData] = useState<TargetDatabase[]>(initialTargetDatabases);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TargetDatabase | null>(null);

  // Filtered data based on search term and filters
  const filteredData = data.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: TargetDatabase) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: TargetDatabase) => {
    if (typeof (window as any).navigateToPage === 'function') {
      (window as any).navigateToPage(`target-database-detail-${item.id}`);
    }
  };


  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kết nối CSDL này?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleSave = (savedData: Omit<TargetDatabase, 'id' | 'lastUpdated'>) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (editingItem) {
      // Edit mode
      setData(data.map(item => item.id === editingItem.id ? { ...savedData, id: editingItem.id, lastUpdated: formattedDate } : item));
    } else {
      // Add mode
      const newItem: TargetDatabase = {
        ...savedData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active',
        lastUpdated: formattedDate
      };
      setData([...data, newItem]);
    }
  };

  const toggleStatus = (id: string) => {
    setData(data.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'active' ? 'inactive' : 'active' };
      }
      return item;
    }));
  };

  // Get unique DB types for filter dropdown
  const uniqueTypes = Array.from(new Set(data.map(item => item.type)));

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <Database className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-slate-800 uppercase tracking-tight" style={{ fontSize: '20px' }}>Quản lý CSDL đích</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý danh sách kết nối và cấu trúc các cơ sở dữ liệu đích</p>
        </div>
      </div>

      {/* Toolbar - Separated from Table Card */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên CSDL, Host hoặc Kiểu kết nối..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
            <button className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center shrink-0 active:scale-95">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 border rounded-lg shadow-sm transition-all flex items-center justify-center shrink-0 active:scale-95 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-slate-700 whitespace-nowrap">Kiểu CSDL:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-slate-700 whitespace-nowrap">Trạng thái:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="text-[13px] text-blue-600 hover:underline font-medium ml-auto"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 w-16 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap">STT</th>
                <th className="py-3 px-6 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Cơ sở dữ liệu</th>
                <th className="py-3 px-6 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap">Kiểu</th>
                <th className="py-3 px-6 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Cập nhật lần cuối</th>
                <th className="py-3 px-6 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap">Trạng thái</th>
                <th className="py-3 px-6 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="py-4 px-6 text-[13px] text-slate-500 text-center font-medium">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                          <Server className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 leading-tight">{item.name}</p>
                          <p className="text-[13px] text-slate-400 mt-1">Schema: {item.schema}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[13px] text-slate-600 font-medium">{item.lastUpdated || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
                            item.status === 'active' ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                            item.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                          {item.status === 'active' ? 'Kích hoạt' : 'Tạm dừng'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết & Cấu trúc"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Chỉnh sửa kết nối"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa kết nối"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Database className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-[13px] font-medium text-slate-600">Không tìm thấy CSDL đích nào.</p>
                      <p className="text-[13px] text-slate-400 mt-1">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Style matched to Source Management */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600">Hiển thị</span>
            <select className="px-2 py-1 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span className="text-[13px] text-slate-600">bản ghi/trang</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-600">
              Hiển thị 1-{filteredData.length} / {filteredData.length} bản ghi
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 opacity-50 cursor-not-allowed text-[13px] font-medium">
                Trước
              </button>
              <button className="px-3 py-1.5 border border-blue-600 bg-blue-600 text-white rounded-lg text-[13px] font-medium">
                1
              </button>
              <button className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 opacity-50 cursor-not-allowed text-[13px] font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Modals */}
      <TargetDatabaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingData={editingItem}
      />
    </div>
  );
}
