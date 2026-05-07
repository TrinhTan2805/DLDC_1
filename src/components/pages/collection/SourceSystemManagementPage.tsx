import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Server } from 'lucide-react';
import { SourceSystemModal } from './SourceSystemModal';
import { SourceSystemDetailModal } from './SourceSystemDetailModal';
import { initialSourceSystems } from './mockSourceSystems';

export function SourceSystemManagementPage() {
  const [data, setData] = useState(initialSourceSystems);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  // Filtered data based on search term
  const filteredData = data.filter(item => 
    item.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sourceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setViewingItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hệ thống nguồn này?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      // Edit mode
      setData(data.map(item => item.id === editingItem.id ? { ...savedData, id: editingItem.id } : item));
    } else {
      // Add mode
      const newItem = {
        ...savedData,
        id: Math.random().toString(36).substr(2, 9) // Generate a random ID
      };
      setData([...data, newItem]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Quản lý hệ thống nguồn</h1>
              <p className="text-sm text-slate-500">Danh sách hệ thống nguồn cung cấp dữ liệu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hệ thống, đơn vị hoặc loại nguồn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">STT</th>
              <th className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Tên hệ thống</th>
              <th className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Tên đơn vị</th>
              <th className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Loại nguồn</th>
              <th className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Đầu mối liên hệ</th>
              <th className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="py-4 px-4 text-sm text-slate-500 text-center font-medium">{index + 1}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-900 text-center">{item.systemName}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 text-center">{item.unitName}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 shadow-sm">
                      {item.sourceType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-sm font-medium text-slate-900">{item.contactPerson || '-'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                        title="Sửa"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Server className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">Không tìm thấy hệ thống nguồn nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <SourceSystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingData={editingItem}
      />

      <SourceSystemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={viewingItem}
      />
    </div>
  );
}
