import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, RefreshCw, Monitor, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { AgentModal } from './AgentModal';
import { AgentDetailModal } from './AgentDetailModal';
import { initialAgents, Agent } from './mockAgents';
import { StatusTag } from '../../common/StatusTag';

export function AgentManagementPage() {
  const [data, setData] = useState<Agent[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Agent | null>(null);
  const [viewingItem, setViewingItem] = useState<Agent | null>(null);

  // Filtered data
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="bg-[#f8f9fa] min-h-full p-6 font-sans">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Quản lý Trạm kết nối</h1>
                <p className="text-sm text-slate-500">Quản lý danh sách các trạm kết nối thu thập dữ liệu</p>
              </div>
            </div>
            <button
 onClick={handleAdd}
 className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
 >
              <Plus className="w-5 h-5" />
              Thêm trạm kết nối
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên trạm kết nối..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-wider">
                <th className="py-4 px-6 w-16 text-center">STT</th>
                <th className="py-4 px-6">Thông tin Trạm kết nối</th>
                <th className="py-4 px-6 text-center">Số CSDL</th>
                <th className="py-4 px-6">Trạng thái hoạt động</th>
                <th className="py-4 px-6">Cập nhật cuối</th>
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
                          <Monitor className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 leading-tight">{item.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
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
                      <div className="text-xs text-slate-600 font-mono">{item.lastDbUpdate}</div>
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
                        <StatusTag 
                          label={item.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'} 
                          variant={item.status === 'active' ? 'blue' : 'slate'} 
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Tải lại"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                  <td colSpan={7} className="py-12 text-center text-slate-500 italic">
                    Không tìm thấy trạm kết nối nào khớp với tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
  );
}
