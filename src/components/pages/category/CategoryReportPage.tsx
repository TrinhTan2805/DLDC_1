import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronDown, Eye, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { LifecycleStatus, ScopeType } from './categoryTypes';
import { lifecycleLabels, scopeLabels } from './categoryConstants';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_OUTLINE, INPUT_CLS,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch
} from '../collection/collectionUi';

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

// Giữ ý nghĩa màu của lifecycleLabels khi chuyển sang Badge (mục 5.8)
const STATUS_VARIANT: Record<LifecycleStatus, string> = {
  active: 'green',
  draft: 'amber',
  inactive: 'red',
  archived: 'slate',
  pending_approval: 'orange',
  pending_expiration: 'purple',
  approved: 'blue',
  rejected: 'red',
};

const mockDatasets: {
  id: string; code: string; name: string; agency: string; scope: ScopeType;
  structureCount: number; status: LifecycleStatus;
}[] = [
  { id: 'category-a-1', code: 'DM-GIOITINH', name: 'Dữ liệu Danh mục giới tính', agency: 'Bộ Tư pháp', scope: 'national', structureCount: 4, status: 'active' },
  { id: 'category-a-2', code: 'DM-DANTOC', name: 'Dữ liệu Danh mục và mã các dân tộc Việt Nam', agency: 'Ủy ban Dân tộc', scope: 'national', structureCount: 54, status: 'active' },
  { id: 'category-a-3', code: 'DM-QUOCGIA', name: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', agency: 'Bộ Ngoại giao', scope: 'national', structureCount: 250, status: 'pending_approval' },
  { id: 'category-a-4', code: 'DM-TONGIAO', name: 'Dữ liệu Danh mục và mã các Tôn giáo', agency: 'Ban Tôn giáo Chính phủ', scope: 'national', structureCount: 16, status: 'pending_approval' },
  { id: 'category-a-5', code: 'DM-COQUAN', name: 'Dữ liệu Danh mục cơ quan', agency: 'Bộ Nội vụ', scope: 'national', structureCount: 45, status: 'pending_approval' },
  { id: 'category-a-6', code: 'DM-HC', name: 'Dữ liệu Danh mục đơn vị hành chính', agency: 'Bộ Nội vụ', scope: 'national', structureCount: 1200, status: 'draft' },
  { id: 'category-a-7', code: 'DM-QUANHEGD', name: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', agency: 'Bộ Tư pháp', scope: 'national', structureCount: 12, status: 'draft' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function CategoryReportPage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({ keyword: '', scope: 'all', status: 'all', agency: 'all' });

  const agencyOptions = Array.from(new Set(mockDatasets.map(d => d.agency)));

  const hasActiveFilters =
    scopeFilter !== 'all' ||
    statusFilter !== 'all' ||
    agencyFilter !== 'all';

  const filteredDatasets = mockDatasets.filter(dataset => {
    const q = normalizeSearch(applied.keyword);
    if (q && !normalizeSearch(dataset.name).includes(q) && !normalizeSearch(dataset.code).includes(q)) return false;
    if (applied.scope !== 'all' && dataset.scope !== applied.scope) return false;
    if (applied.status !== 'all' && dataset.status !== applied.status) return false;
    if (applied.agency !== 'all' && dataset.agency !== applied.agency) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDatasets = filteredDatasets.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleResetFilters = () => {
    setScopeFilter('all');
    setStatusFilter('all');
    setAgencyFilter('all');
    setApplied(prev => ({ ...prev, scope: 'all', status: 'all', agency: 'all' }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setApplied({ keyword: searchKeyword, scope: scopeFilter, status: statusFilter, agency: agencyFilter });
    setCurrentPage(1);
  };

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    toast.success(`Xuất dữ liệu ra ${format}`);
  };

  return (
    <div className="space-y-4 text-[13px]">
      {/* Tìm kiếm & bộ lọc (mục 5.19) */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                aria-label="Từ khóa"
                placeholder="Nhập mã danh mục, tên danh mục..."
                value={searchKeyword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className={SEARCH_INPUT_CLS}
              />
            </div>
            <button
              type="button"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
              onClick={handleSearch}
              className={SEARCH_BTN_CLS}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Bộ lọc"
              title="Bộ lọc"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(prev => !prev)}
              className={filterBtnClass(showFilters)}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {hasActiveFilters && (
              <button type="button" onClick={handleResetFilters} className={BTN_OUTLINE}>
                Đặt lại
              </button>
            )}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowExportMenu(prev => !prev)}
                aria-expanded={showExportMenu}
                className={BTN_OUTLINE}
              >
                <Download className="w-4 h-4" />
                Kết xuất
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-[#E2E8F0] bg-white shadow-lg z-20 p-1">
                  {['Excel', 'PDF', 'CSV'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => handleExportFile(fmt)}
                      className="w-full min-h-8 px-3 py-1.5 rounded-md text-left text-[13px] text-[#020817] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                title="Trạng thái"
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
              >
                <option value="all">Tất cả</option>
                <option value="active">Hiệu lực</option>
                <option value="pending_approval">Chờ phê duyệt</option>
                <option value="draft">Đang soạn thảo</option>
                <option value="inactive">Hết hiệu lực</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Phạm vi</label>
              <select
                title="Phạm vi"
                value={scopeFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setScopeFilter(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
              >
                <option value="all">Tất cả</option>
                <option value="national">Cấp quốc gia</option>
                <option value="ministry">Cấp bộ</option>
                <option value="provincial">Cấp tỉnh/thành</option>
                <option value="internal">Sử dụng nội bộ</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Đơn vị chủ quản</label>
              <select
                title="Đơn vị chủ quản"
                value={agencyFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgencyFilter(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
              >
                <option value="all">Tất cả</option>
                {agencyOptions.map(agency => (
                  <option key={agency} value={agency}>{agency}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bảng + phân trang (mục 5.3, 5.14) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left w-px`}>Mã danh mục</th>
                <th className={`${TH} text-left min-w-[220px]`}>Tên danh mục</th>
                <th className={`${TH} text-left min-w-[140px]`}>Đơn vị chủ quản</th>
                <th className={`${TH} text-left w-px`}>Phạm vi</th>
                <th className={`${TH} text-right w-px`}>Trường thuộc tính</th>
                <th className={`${TH} text-left w-px`}>Trạng thái</th>
                <th className={`${TH} text-center w-px`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDatasets.length > 0 ? (
                paginatedDatasets.map((dataset, index) => (
                  <tr key={dataset.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center whitespace-nowrap`}>{(safePage - 1) * pageSize + index + 1}</td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{dataset.code}</td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={dataset.name} />
                    </td>
                    <td className={`${TD} text-left max-w-[240px]`}>
                      <TruncatedText text={dataset.agency} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{scopeLabels[dataset.scope] ?? dataset.scope}</td>
                    <td className={`${TD} text-right whitespace-nowrap tabular-nums`}>{dataset.structureCount} trường</td>
                    <td className={`${TD} text-left`}>
                      <Badge label={lifecycleLabels[dataset.status].label} variant={STATUS_VARIANT[dataset.status]} />
                    </td>
                    <td className={`${TD} text-center`}>
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction
                          label="Xem chi tiết"
                          onClick={() => navigate(`/category-list?category=${dataset.id}&mode=readonly`)}
                        >
                          <Eye className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredDatasets.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={safePage}
            totalItems={filteredDatasets.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        )}
      </div>
    </div>
  );
}
