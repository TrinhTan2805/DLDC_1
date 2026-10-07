import React, { useEffect, useState } from 'react';
import { Search, Filter, X, Eye, History } from 'lucide-react';
import { CategoryItem } from '../../OpenDataCategoryPage';
import {
  Badge, TruncatedText, RowIconAction, Pagination,
  INPUT_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL
} from '../../../collection/collectionUi';

interface FilesTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredData: CategoryItem[];
  paginatedData: CategoryItem[];
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  onViewDetail: (item: CategoryItem) => void;
  onViewVersion?: (item: CategoryItem) => void;
  activeTab: string;
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
}

// --- Lớp giao diện bảng (compomennt.md 5.3) ---
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const STICKY_TH = 'sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD = 'sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';

// Cùng bộ nhãn trạng thái với màn "Công bố dữ liệu mở" (OpenDataPublishedListPage)
const STATUS_BADGES: Record<string, { label: string; variant: string }> = {
  approved: { label: 'Đã công bố', variant: 'green' },
  pending: { label: 'Chờ công bố', variant: 'purple' },
  rejected: { label: 'Từ chối', variant: 'red' },
  draft: { label: 'Bản nháp', variant: 'slate' },
};

export function FilesTab({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredData,
  paginatedData,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onViewDetail,
  onViewVersion,
  activeTab,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter
}: FilesTabProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Giá trị đang nhập — chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [statusInput, setStatusInput] = useState(statusFilter);
  const [startDateInput, setStartDateInput] = useState(startDateFilter);
  const [endDateInput, setEndDateInput] = useState(endDateFilter);

  // Đồng bộ khi bộ lọc được đặt từ bên ngoài
  useEffect(() => { setSearchInput(searchTerm); }, [searchTerm]);
  useEffect(() => { setStatusInput(statusFilter); }, [statusFilter]);
  useEffect(() => { setStartDateInput(startDateFilter); }, [startDateFilter]);
  useEffect(() => { setEndDateInput(endDateFilter); }, [endDateFilter]);

  const runSearch = () => {
    setSearchTerm(searchInput);
    setStatusFilter(statusInput);
    setStartDateFilter(startDateInput);
    setEndDateFilter(endDateInput);
    setCurrentPage(1);
  };

  const onEnter = (e: React.KeyboardEvent) => { if (e.key === 'Enter') runSearch(); };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            title="Tìm kiếm"
            aria-label="Tìm kiếm"
            placeholder="Tìm kiếm theo mã, tên tệp dữ liệu..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={onEnter}
            className={SEARCH_INPUT_CLS}
          />
          <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={showFilters ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}
            title={showFilters ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}
            aria-expanded={showFilters}
            onClick={() => setShowFilters(!showFilters)}
            className={filterBtnClass(showFilters)}
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        {/* Vùng bộ lọc nâng cao (compomennt.md 5.19) */}
        {showFilters && (
          <div className={FILTER_GRID_CLS}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái công khai</label>
              <select
                title="Trạng thái công khai"
                aria-label="Trạng thái công khai"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã công khai</option>
                <option value="unpublished">Chưa công khai</option>
              </select>
            </div>
            <div>
              <label className={FILTER_LABEL}>Ngày tạo</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  title="Từ ngày"
                  aria-label="Từ ngày"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  onKeyDown={onEnter}
                  className={INPUT_CLS}
                  placeholder="Từ ngày"
                />
                <input
                  type="date"
                  title="Đến ngày"
                  aria-label="Đến ngày"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  onKeyDown={onEnter}
                  className={INPUT_CLS}
                  placeholder="Đến ngày"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bảng dữ liệu + phân trang (compomennt.md 5.3, 5.14) */}
      <div className={TABLE_WRAP}>
        <div className="overflow-x-auto">
          <table className={TABLE_CLS}>
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Tên tệp dữ liệu</th>
                <th className={`${TH} text-left`}>Cơ quan công bố</th>
                <th className={`${TH} text-left`}>Ngày tạo</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const badge = STATUS_BADGES[item.approvalStatus];
                  return (
                    <tr key={item.id} className={TR}>
                      <td className={`${TD} text-center`}>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className={`${TD} max-w-[360px]`}>
                        <TruncatedText text={item.fileName || `${item.name}.xlsx`} />
                      </td>
                      <td className={`${TD} max-w-[240px]`}>
                        <TruncatedText text={item.publisher || '--'} />
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>{item.createdDate}</td>
                      <td className={TD}>
                        <Badge label={badge ? badge.label : 'Chờ công bố'} variant={badge ? badge.variant : 'purple'} />
                      </td>
                      <td className={`${TD} text-center ${STICKY_TD}`}>
                        <div className="flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => onViewDetail(item)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          {activeTab === 'category' && (
                            <RowIconAction label="Lịch sử phiên bản" onClick={() => onViewVersion && onViewVersion(item)}>
                              <History className="w-4 h-4" />
                            </RowIconAction>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className={EMPTY_TD}>Không tìm thấy dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </div>
  );
}
