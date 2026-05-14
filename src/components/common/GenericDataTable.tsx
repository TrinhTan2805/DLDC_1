import React, { useState, ChangeEvent } from 'react';
import { Search, Filter, Upload, Download, RefreshCw, Database, Server, History as HistoryIcon } from 'lucide-react';
import { ActionIconButton } from './ActionIconButton';
import { AdvancedSearchModal } from './AdvancedSearchModal';
import { ImportDataModal } from './ImportDataModal';
import { DataDetailModal } from './DataDetailModal';
import { APIConnectionManager } from './APIConnectionManager';
import { SyncHistoryTable } from './SyncHistoryTable';
import { TabView } from './TabView';

// Note: History is imported as HistoryIcon to avoid conflict with browser's History API
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface GenericDataTableProps {
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  columns: Column[];
  data: any[];
  searchFields: { label: string; name: string; type: 'text' | 'select' | 'date'; options?: string[] }[];
  detailFields: { label: string; key: string }[];
  apiEndpoint?: string;
  lastSyncTime?: string;
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  onSync?: () => void;
}

export function GenericDataTable({
  title,
  description,
  icon: Icon,
  iconColor,
  columns,
  data,
  searchFields,
  detailFields,
  apiEndpoint,
  lastSyncTime,
  onAdd,
  onEdit,
  onDelete,
  onSync
}: GenericDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [detailMode, setDetailMode] = useState<'simple' | 'compare' | 'merge'>('simple');

  const itemsPerPage = 10;

  // Filter data based on search term and advanced filters
  const filteredData = data.filter(item => {
    // Basic search
    const matchesSearch = Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Advanced filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleImport = (file: File) => {
    console.log('Importing file:', file.name);
    alert(`Đã nhập file: ${file.name}`);
  };

  const handleExport = () => {
    console.log('Exporting data...');
    alert('Đang xuất dữ liệu...');
  };

  const handleViewDetail = (item: any) => {
    setSelectedItem(item);
    setDetailMode('merge'); // Changed to merge mode to show tabs with data sources
    setShowDetail(true);
  };

  const handleViewDetailSimple = (item: any) => {
    setSelectedItem(item);
    setDetailMode('simple'); // Simple mode for "Xem chi tiết" button
    setShowDetail(true);
  };

  // Data List Tab Content
  const dataListContent = (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-1 rounded-lg">
        <div className="flex-1 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Advanced Search */}
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Lọc nâng cao
            </button>

            {/* Import */}
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Nhập dữ liệu
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium text-sm shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            Kết xuất
          </button>

          {/* Sync */}
          {onSync && (
            <button
              onClick={onSync}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-md active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Đồng bộ ngay
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-2">Bộ lọc:</span>
          {Object.entries(filters).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium"
            >
              <span className="opacity-60">{key}:</span> {String(value)}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters[key];
                  setFilters(newFilters);
                }}
                className="hover:text-blue-900 ml-1 bg-blue-200/50 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={() => setFilters({})}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors ml-2"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-500">
                  STT
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-slate-500">
                  Tình trạng
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-center text-sm font-medium text-slate-500"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-4 py-3 text-sm text-slate-500 text-center font-medium">
                      {(startIndex + index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.originalData && Object.keys(item.originalData).length > 0 ? (
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="text-xs font-medium uppercase tracking-tighter px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-all shadow-sm"
                          title="Click để xem thông tin đã sửa"
                        >
                          Đã hiệu chỉnh
                        </button>
                      ) : (
                        <span className="text-xs font-medium uppercase tracking-tighter px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full">Nguyên bản</span>
                      )}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm text-slate-700 text-center font-medium group-hover:text-slate-950 transition-colors">
                        {item[col.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <ActionIconButton action="view" onClick={() => handleViewDetailSimple(item)} title="Xem chi tiết" />
                        {onEdit && (
                          <ActionIconButton action="edit" onClick={() => onEdit(item)} title="Sửa" />
                        )}
                        {onDelete && (
                          <ActionIconButton action="delete" onClick={() => onDelete(item.id)} title="Xóa" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 3}
                    className="px-6 py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Database className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">Không tìm thấy dữ liệu phù hợp với bộ lọc</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Hiển thị</span>
              <select 
                className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                title="Số bản ghi trên trang"
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-slate-600">bản ghi/trang</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} / {filteredData.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Tabs */}
      {apiEndpoint ? (
        <TabView
          tabs={[
            { id: 'data', label: 'Danh sách dữ liệu', icon: Database },
            { id: 'api', label: 'Cấu hình kết nối nguồn', icon: Server },
            { id: 'history', label: 'Lịch sử đồng bộ', icon: HistoryIcon }
          ]}
        >
          {/* Tab 1: Data List */}
          {dataListContent}

          {/* Tab 2: API Connection Form */}
          <APIConnectionManager />

          {/* Tab 3: Sync History */}
          <SyncHistoryTable
            records={[
              { 
                id: 1, 
                timestamp: '09/12/2025 14:30:25', 
                status: 'success', 
                recordsAdded: 150, 
                recordsUpdated: 45, 
                recordsFailed: 0, 
                totalRecords: 195, 
                duration: '2.5s' 
              },
              { 
                id: 2, 
                timestamp: '09/12/2025 10:15:10', 
                status: 'success', 
                recordsAdded: 98, 
                recordsUpdated: 32, 
                recordsFailed: 0, 
                totalRecords: 130, 
                duration: '1.8s' 
              },
              { 
                id: 3, 
                timestamp: '08/12/2025 18:45:33', 
                status: 'partial', 
                recordsAdded: 120, 
                recordsUpdated: 28, 
                recordsFailed: 5, 
                totalRecords: 153, 
                duration: '3.2s', 
                message: '5 bản ghi lỗi định dạng',
                errors: [
                  {
                    id: 1,
                    recordId: 'GEN-2025-001234',
                    fieldName: 'Số CCCD',
                    errorType: 'Sai định dạng',
                    errorMessage: 'Số CCCD phải có đúng 12 chữ số',
                    originalValue: '001234567',
                    expectedFormat: '001234567890',
                    timestamp: '08/12/2025 18:45:33'
                  },
                  {
                    id: 2,
                    recordId: 'GEN-2025-001235',
                    fieldName: 'Ngày sinh',
                    errorType: 'Sai định dạng',
                    errorMessage: 'Định dạng ngày không hợp lệ',
                    originalValue: '15/13/1990',
                    expectedFormat: 'DD/MM/YYYY',
                    timestamp: '08/12/2025 18:45:33'
                  },
                  {
                    id: 3,
                    recordId: 'GEN-2025-001236',
                    fieldName: 'Email',
                    errorType: 'Sai định dạng',
                    errorMessage: 'Địa chỉ email không hợp lệ',
                    originalValue: 'user@invalid',
                    expectedFormat: 'user@domain.com',
                    timestamp: '08/12/2025 18:45:33'
                  },
                  {
                    id: 4,
                    recordId: 'GEN-2025-001237',
                    fieldName: 'Số điện thoại',
                    errorType: 'Thiếu dữ liệu',
                    errorMessage: 'Trường bắt buộc không được để trống',
                    originalValue: '',
                    expectedFormat: '0xxxxxxxxx (10 chữ số)',
                    timestamp: '08/12/2025 18:45:33'
                  },
                  {
                    id: 5,
                    recordId: 'GEN-2025-001238',
                    fieldName: 'Mã danh mục',
                    errorType: 'D liệu không tồn tại',
                    errorMessage: 'Mã danh mục không tồn tại trong hệ thống',
                    originalValue: 'DM999',
                    expectedFormat: 'DM001-DM050',
                    timestamp: '08/12/2025 18:45:33'
                  }
                ]
              },
              { 
                id: 4, 
                timestamp: '08/12/2025 14:20:15', 
                status: 'success', 
                recordsAdded: 210, 
                recordsUpdated: 67, 
                recordsFailed: 0, 
                totalRecords: 277, 
                duration: '4.1s' 
              },
              { 
                id: 5, 
                timestamp: '08/12/2025 10:10:05', 
                status: 'success', 
                recordsAdded: 88, 
                recordsUpdated: 19, 
                recordsFailed: 0, 
                totalRecords: 107, 
                duration: '1.5s' 
              },
            ]}
          />
        </TabView>
      ) : (
        // If no API endpoint, just show data list without tabs
        dataListContent
      )}

      {/* Modals */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        fields={searchFields}
      />

      <ImportDataModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <DataDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        data={selectedItem}
        fields={detailFields}
        title={`Chi tiết ${title}`}
        mode={detailMode}
      />
    </div>
  );
}