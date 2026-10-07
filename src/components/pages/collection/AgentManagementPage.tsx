import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, CheckCircle2, XCircle, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { AgentModal } from './AgentModal';
import { AgentDetailModal } from './AgentDetailModal';
import { AgentDeleteConfirmModal } from './AgentDeleteConfirmModal';
import { initialAgents, Agent } from './mockAgents';
import { Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_FOCUS, INPUT_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch } from './collectionUi';

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

export function AgentManagementPage() {
  const [data, setData] = useState<Agent[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  // Tìm kiếm & bộ lọc chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterStatus: 'all' });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Agent | null>(null);
  const [viewingItem, setViewingItem] = useState<Agent | null>(null);
  const [deletingItem, setDeletingItem] = useState<Agent | null>(null);

  // Filtered data
  const filteredData = data.filter(item => {
    const matchesSearch = normalizeSearch(item.name).includes(normalizeSearch(applied.searchTerm));
    const matchesStatus = applied.filterStatus === 'all' || item.status === applied.filterStatus;
    return matchesSearch && matchesStatus;
  });

  const runSearch = () => {
    setApplied({ searchTerm, filterStatus });
    setCurrentPage(1);
  };

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

  const handleDelete = (item: Agent) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
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
    toast.info('Đang kết xuất danh sách trạm kết nối ra file Excel...');
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý Trạm kết nối</h1>
        <p className="text-[13px] text-[#64748B]">Quản lý danh sách các trạm kết nối thu thập dữ liệu</p>
      </div>

      {/* Toolbar */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              aria-label="Tìm kiếm trạm kết nối"
              type="text"
              placeholder="Tìm kiếm theo tên trạm, địa chỉ IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              className={SEARCH_INPUT_CLS}
            />
            <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Bộ lọc"
              title="Bộ lọc"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className={filterBtnClass(showFilters)}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Bộ lọc (thu gọn) — áp dụng khi bấm Tìm kiếm */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                aria-label="Trạng thái"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Thông tin Trạm kết nối</th>
                <th className={`${TH} text-right`}>Số CSDL</th>
                <th className={`${TH} text-left`}>Trạng thái hoạt động</th>
                <th className={`${TH} text-left`}>Cập nhật cuối</th>
                <th className={`${TH} text-center`}>Trạng thái</th>
                <th className={`${TH} text-center w-32 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item, index) => {
                    // Ngày + giờ hiển thị 2 dòng (5.3.3) — dữ liệu đã ở dạng dd/mm/yyyy HH:mm:ss
                    const [updDate, ...updTime] = (item.lastDbUpdate || '').split(' ');
                    return (
                    <tr key={item.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                        <TruncatedText text={item.name} />
                        <TruncatedText text={`ID: ${item.id}`} className="text-[#64748B]" />
                      </td>
                      <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>
                        {item.databases.length}
                      </td>
                      <td className={`${TD} text-left`}>
                        <Badge
                          label={item.fileAgent.isActive ? 'Có hoạt động' : 'Không hoạt động'}
                          variant={item.fileAgent.isActive ? 'emerald' : 'red'}
                          icon={item.fileAgent.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                        <div>{updDate || '-'}</div>
                        {updTime.length > 0 && <div className="text-[#64748B]">{updTime.join(' ')}</div>}
                      </td>
                      <td className={`${TD} text-center`}>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.status === 'active'}
                          aria-label="Trạng thái"
                          onClick={() => toggleStatus(item.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${BTN_FOCUS} ${
                            item.status === 'active' ? 'bg-blue-600' : 'bg-[#CBD5E1]'
                          }`}
                        >
                          <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white transition-transform ${
                            item.status === 'active' ? 'translate-x-[18px]' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="inline-flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => handleView(item)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Sửa" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Xóa" onClick={() => handleDelete(item)}>
                            <Trash2 className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px] text-[#64748B]">
                    <p>Không tìm thấy trạm kết nối nào.</p>
                    <p className="mt-1">Vui lòng thử lại với từ khóa khác.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredData.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
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

      <AgentDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={() => {
          if (deletingItem) {
            setData(data.filter(item => item.id !== deletingItem.id));
          }
        }}
        agentName={deletingItem?.name || ''}
      />
    </div>
  );
}
