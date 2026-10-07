import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Database, Filter, X } from 'lucide-react';
import { TargetDatabaseModal } from './TargetDatabaseModal';
import { initialTargetDatabases, TargetDatabase } from './mockTargetDatabases';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_OUTLINE, BTN_FOCUS, INPUT_CLS,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch,
} from '../collection/collectionUi';

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-left text-[13px] text-black';

export function TargetDatabaseManagementPage() {
  const [data, setData] = useState<TargetDatabase[]>(initialTargetDatabases);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const EMPTY_FILTERS = { searchTerm: '', filterType: 'all', filterStatus: 'all' };
  const [applied, setApplied] = useState(EMPTY_FILTERS);

  // Phân trang (compomennt.md 5.14)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TargetDatabase | null>(null);

  // Filtered data based on search term and filters
  const filteredData = data.filter(item => {
    const q = normalizeSearch(applied.searchTerm);
    const matchSearch = normalizeSearch(item.name).includes(q) ||
                        normalizeSearch(item.host).includes(q) ||
                        normalizeSearch(item.type).includes(q);
    const matchType = applied.filterType === 'all' || item.type === applied.filterType;
    const matchStatus = applied.filterStatus === 'all' || item.status === applied.filterStatus;

    return matchSearch && matchType && matchStatus;
  });
  const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const runSearch = () => {
    setApplied({ searchTerm, filterType, filterStatus });
    setCurrentPage(1);
  };

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
    <div>
      <div className="h-full flex flex-col bg-[#F8FAFC] p-6 space-y-4 min-h-screen">
      {/* Header (H1 — compomennt.md mục 1) */}
      <div>
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý CSDL đích</h1>
        <p className="text-[13px] text-[#64748B]">Quản lý danh sách kết nối và cấu trúc các cơ sở dữ liệu đích</p>
      </div>

      {/* Thanh tìm kiếm & bộ lọc (compomennt.md 5.19) */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm CSDL đích"
              placeholder="Tìm kiếm theo tên CSDL, Host hoặc Kiểu kết nối..."
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

          <div className="flex items-center gap-1.5">
            <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Kiểu CSDL</label>
              <select
                aria-label="Kiểu CSDL"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                aria-label="Trạng thái"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setApplied(EMPTY_FILTERS);
                  setCurrentPage(1);
                }}
                className={BTN_OUTLINE}
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Card (compomennt.md 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
              <tr className="h-[42px]">
                <th className={`${TH.replace('text-left', 'text-center')} w-12`}>STT</th>
                <th className={`${TH} min-w-[220px]`}>Cơ sở dữ liệu</th>
                <th className={TH}>Kiểu</th>
                <th className={TH}>Cập nhật lần cuối</th>
                <th className={TH}>Trạng thái</th>
                <th className={`${TH.replace('text-left', 'text-center')} w-px sticky right-0 z-[1] bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length > 0 ? (
                pagedData.map((item, index) => {
                  const [datePart, timePart] = (item.lastUpdated || '').split(' ');
                  return (
                  <tr key={item.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD.replace('text-left', 'text-center')} whitespace-nowrap`}>{((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}</td>
                    <td className={`${TD} max-w-[360px] leading-[18px]`}>
                      <TruncatedText text={item.name} />
                      <TruncatedText text={`Schema: ${item.schema}`} className="text-[#64748B]" />
                    </td>
                    <td className={TD}>
                      <Badge label={item.type} variant="slate" />
                    </td>
                    <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                      {item.lastUpdated ? (
                        <>
                          <div>{datePart}</div>
                          {timePart && <div className="text-[#64748B]">{timePart}</div>}
                        </>
                      ) : 'N/A'}
                    </td>
                    <td className={`${TD} whitespace-nowrap`}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.status === 'active'}
                          aria-label={item.status === 'active' ? 'Kích hoạt' : 'Tạm dừng'}
                          onClick={() => toggleStatus(item.id)}
                          className={`relative w-9 h-5 shrink-0 rounded-full transition-colors ${BTN_FOCUS} ${item.status === 'active' ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.status === 'active' ? 'left-[18px]' : 'left-0.5'}`} />
                        </button>
                        <span className="text-[13px] text-[#020817]">
                          {item.status === 'active' ? 'Kích hoạt' : 'Tạm dừng'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-1 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]">
                      {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác → hiện đủ nút icon */}
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction label="Xem chi tiết & Cấu trúc" onClick={() => handleView(item)}>
                          <Eye className="w-4 h-4" />
                        </RowIconAction>
                        <RowIconAction label="Chỉnh sửa kết nối" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </RowIconAction>
                        <RowIconAction label="Xóa kết nối" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Database className="w-10 h-10 text-[#CBD5E1] mb-3" />
                      <p className="text-[13px] text-[#64748B]">Không tìm thấy CSDL đích nào.</p>
                      <p className="text-[13px] text-[#64748B] mt-1">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (compomennt.md 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredData.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
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
