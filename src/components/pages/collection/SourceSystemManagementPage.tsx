import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Server, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SourceSystemModal } from './SourceSystemModal';
import { SourceSystemDetailModal } from './SourceSystemDetailModal';
import { initialSourceSystems } from './mockSourceSystems';
import { StatusTag } from '../../common/StatusTag';

export function SourceSystemManagementPage() {
  const [data, setData] = useState(initialSourceSystems);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
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

  const handleExport = () => {
    alert('Đang kết xuất danh sách hệ thống nguồn ra file Excel...');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <Server className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 uppercase tracking-tight">Quản lý hệ thống nguồn</h1>
          <p className="text-base text-slate-500 mt-1">Danh sách hệ thống nguồn cung cấp dữ liệu</p>
        </div>
      </div>

      {/* Toolbar - Separated from Table Card */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hệ thống, đơn vị hoặc loại nguồn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-base shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">


        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-center text-base font-semibold text-slate-500 whitespace-nowrap w-12">STT</th>
                <th className="py-3 px-4 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Tên hệ thống</th>
                <th className="py-3 px-4 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Tên đơn vị</th>
                <th className="py-3 px-4 text-center text-base font-semibold text-slate-500 whitespace-nowrap">Loại nguồn</th>
                <th className="py-3 px-4 text-center text-base font-semibold text-slate-500 whitespace-nowrap">Đầu mối liên hệ</th>
                <th className="py-3 px-4 text-center text-base font-semibold text-slate-500 whitespace-nowrap w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.length > 0 ? (
                filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                      <td className="py-4 px-4 text-base text-slate-500 text-center font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-base font-semibold text-slate-900">{item.systemName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-base text-slate-600">{item.unitName}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <StatusTag 
                          label={item.sourceType} 
                          variant={item.sourceType === 'Trong ngành' ? 'purple' : 'blue'} 
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-base font-medium text-slate-900">{item.contactPerson || '-'}</div>
                        <div className="text-base text-slate-500 mt-0.5">{item.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa"
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
                        <Server className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-base font-medium text-slate-600">Không tìm thấy hệ thống nguồn nào.</p>
                      <p className="text-base text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>



        {/* Pagination - Moved back to Bottom */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
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
              {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} / {filteredData.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-base font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
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
                  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage) || filteredData.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-base font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
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
    </div>
  );
}
