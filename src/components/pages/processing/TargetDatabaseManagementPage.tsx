import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Database, Server, RefreshCw, Filter, Network } from 'lucide-react';
import { TargetDatabaseModal } from './TargetDatabaseModal';
import { TargetDatabaseDetailModal } from './TargetDatabaseDetailModal';
import { DataMappingModal } from './DataMappingModal';
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TargetDatabase | null>(null);
  const [viewingItem, setViewingItem] = useState<TargetDatabase | null>(null);
  const [mappingItem, setMappingItem] = useState<TargetDatabase | null>(null);

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
    setViewingItem(item);
    setIsDetailModalOpen(true);
  };

  const handleMapping = (item: TargetDatabase) => {
    setMappingItem(item);
    setIsMappingModalOpen(true);
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
    <div className="bg-[#f8f9fa] min-h-full p-6 font-sans">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header & Toolbar */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Quản lý CSDL đích</h1>
                <p className="text-sm text-slate-500">Quản lý danh sách kết nối và cấu trúc các cơ sở dữ liệu đích</p>
              </div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên CSDL, Host hoặc Kiểu kết nối..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
            <button className="px-4 py-2.5 bg-[#00bfa5] text-white rounded-lg hover:bg-[#00a08a] transition-colors flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg transition-colors flex items-center justify-center shrink-0 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={handleAdd}
              className="px-5 py-2.5 bg-[#2962ff] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shrink-0"
            >
              <Plus className="w-5 h-5" />
              Thêm mới
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Lọc theo:</span>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả kiểu CSDL</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-wider">
                <th className="py-4 px-6 w-16 text-center">STT</th>
                <th className="py-4 px-6">Cơ sở dữ liệu</th>
                <th className="py-4 px-6 text-center">Kiểu</th>
                <th className="py-4 px-6">Cập nhật lần cuối</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="py-4 px-6 text-sm text-slate-500 text-center font-mono">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                          <Server className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{item.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Schema: {item.schema}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-600 font-mono">{item.lastUpdated || 'N/A'}</div>
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
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          {item.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết & Cấu trúc"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMapping(item)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Ánh xạ dữ liệu"
                        >
                          <Network className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Chỉnh sửa kết nối"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                  <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                        <Database className="w-8 h-8 text-slate-200" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Không có kết quả</h3>
                      <p className="text-sm text-slate-500">Không tìm thấy kết nối CSDL nào phù hợp với điều kiện tìm kiếm của bạn.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilterType('all');
                          setFilterStatus('all');
                        }}
                        className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>Hiển thị {filteredData.length} trên tổng số {data.length} kết nối</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Kích hoạt</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Không kích hoạt</span>
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

      <TargetDatabaseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={viewingItem}
      />

      <DataMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        data={mappingItem}
      />
    </div>
  );
}
