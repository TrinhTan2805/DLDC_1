import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Network, X, Save } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { Unit } from './ConnectionManagementPage';

interface UnitManagementPageProps {
  units: Unit[];
  onUnitsChange: (units: Unit[]) => void;
}

export function UnitManagementPage({ units, onUnitsChange }: UnitManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Unit | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Unit, 'id'>>({
    unitName: '',
    unitCode: '',
    unitType: 'Trong ngành'
  });

  // Filtered data based on search term
  const filteredData = units.filter(item => 
    item.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unitType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      unitName: '',
      unitCode: '',
      unitType: 'Trong ngành'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Unit) => {
    setEditingItem(item);
    setFormData({
      unitName: item.unitName,
      unitCode: item.unitCode,
      unitType: item.unitType
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
      onUnitsChange(units.filter(item => item.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // Edit mode
      onUnitsChange(units.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id } : item));
    } else {
      // Add mode
      const newItem = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      };
      onUnitsChange([...units, newItem]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
            <Network className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-slate-800 uppercase tracking-tight" style={{ fontSize: '20px' }}>Quản lý đơn vị</h1>
            <p className="text-[13px] text-slate-500 mt-1">Danh sách đơn vị, cơ quan, tổ chức trong hệ thống</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên đơn vị, mã đơn vị hoặc loại đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
            </div>
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

        {/* Table Card */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-12">STT</th>
                  <th className="py-3 px-4 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên đơn vị</th>
                  <th className="py-3 px-4 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap w-48">Mã đơn vị</th>
                  <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-48">Loại đơn vị</th>
                  <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredData.length > 0 ? (
                  filteredData
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="py-4 px-4 text-[13px] text-slate-500 text-center font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-[13px] font-semibold text-slate-900">{item.unitName}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-[13px] text-slate-600 font-mono font-medium">{item.unitCode}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <StatusTag 
                            label={item.unitType} 
                            variant={item.unitType === 'Trong ngành' ? 'purple' : 'blue'} 
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
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
                    <td colSpan={5} className="py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                          <Network className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="text-[13px] font-medium text-slate-600">Không tìm thấy đơn vị nào.</p>
                        <p className="text-[13px] text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-slate-600">Hiển thị</span>
              <select 
                className="px-2 py-1 border border-slate-300 rounded text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              <span className="text-[13px] text-slate-600">bản ghi/trang</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-slate-600">
                {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} / {filteredData.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-[13px] font-medium"
                >
                  Trước
                </button>
                
                {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-lg text-[13px] font-medium transition-colors ${
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
                  className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-[13px] font-medium"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]" style={{ fontSize: '13px' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingItem ? 'Sửa thông tin đơn vị' : 'Thêm mới đơn vị'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto">
              <form id="unit-form" onSubmit={handleSave} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      Tên đơn vị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.unitName}
                      onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px]"
                      placeholder="Nhập tên đơn vị"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      Mã đơn vị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.unitCode}
                      onChange={(e) => setFormData({ ...formData, unitCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px] font-mono"
                      placeholder="Nhập mã đơn vị"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      Loại đơn vị
                    </label>
                    <select
                      value={formData.unitType}
                      onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px]"
                    >
                      <option value="Trong ngành">Trong ngành</option>
                      <option value="Ngoài ngành">Ngoài ngành</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-[13px]"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="unit-form"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-medium text-[13px]"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
