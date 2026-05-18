import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, RefreshCw, Monitor, Shield, CheckCircle2, XCircle, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { AgentModal } from './AgentModal';
import { AgentDetailModal } from './AgentDetailModal';
import { initialAgents, Agent } from './mockAgents';
import { StatusTag } from '../../common/StatusTag';

export function AgentManagementPage() {
  const [data, setData] = useState<Agent[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Agent | null>(null);
  const [viewingItem, setViewingItem] = useState<Agent | null>(null);

  // Filtered data
  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Agent) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: Agent) => {
    setViewingItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa agent này?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...savedData } : item));
    } else {
      const newItem: Agent = {
        ...initialAgents[0], // fallback for fields not in form
        id: Math.random().toString(36).substr(2, 5),
        name: savedData.name,
        status: savedData.status,
        callCycle: parseInt(savedData.callCycle),
        fileAgent: {
          id: savedData.fileAgentId || 'NEW-ID',
          url: savedData.fileAgentUrl || '',
          isActive: false,
          status: savedData.status
        },
        databases: []
      };
      setData([...data, newItem]);
    }
  };

  const toggleStatus = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    ));
  };

  const handleExport = () => {
    alert('Đang kết xuất danh sách trạm kết nối ra file Excel...');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <Monitor className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-slate-800 uppercase tracking-tight" style={{ fontSize: '20px' }}>Quản lý Trạm kết nối</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý danh sách các trạm kết nối thu thập dữ liệu</p>
        </div>
      </div>

      {/* Toolbar - Separated */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input aria-label="Input field"
              type="text"
              placeholder="Tìm kiếm theo tên trạm, địa chỉ IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
          <div className="w-48">
            <select aria-label="Select box"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
            </select>
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
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse collection-table" style={{ fontSize: '13px' }}>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-tight sticky top-0 z-10">
                <th className="py-4 px-6 w-16 text-center">STT</th>
                <th className="py-4 px-6">Thông tin Trạm kết nối</th>
                <th className="py-4 px-6 text-center">Số CSDL</th>
                <th className="py-4 px-6">Trạng thái hoạt động</th>
                <th className="py-4 px-6">Cập nhật cuối</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.length > 0 ? (
                filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-all group">
                      <td className="py-4 px-6 text-slate-500 text-center font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                            <Monitor className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">{item.name}</div>
                            <div className="text-slate-400 mt-1">ID: {item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          {item.databases.length}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <StatusTag 
                            label={item.fileAgent.isActive ? 'Có hoạt động' : 'Không hoạt động'} 
                            variant={item.fileAgent.isActive ? 'emerald' : 'red'}
                            icon={item.fileAgent.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-600">{item.lastDbUpdate}</div>
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
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
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
                  <td colSpan={7} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Monitor className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-[13px] font-medium text-slate-600">Không tìm thấy trạm kết nối nào.</p>
                      <p className="text-[13px] text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-white sticky bottom-0 collection-pagination" style={{ fontSize: '13px' }}>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hiển thị</span>
            <select 
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            <span className="text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} / {filteredData.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg font-medium transition-colors ${
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
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingData={editingItem}
      />

      <AgentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={viewingItem}
      />
    </div>
    </div>
  );
}
