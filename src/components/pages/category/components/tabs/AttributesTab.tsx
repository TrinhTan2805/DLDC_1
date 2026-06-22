import React, { ChangeEvent, useState } from 'react';
import { 
  Plus, Search, Filter, X, ChevronDown, Eye, Edit2, Trash2, Send,
  FileText, CheckSquare, Tag
} from 'lucide-react';
import { MasterDataEntity, MasterDataAttribute, FieldDataType } from '../../categoryTypes';

interface AttributesTabProps {
  entities: MasterDataEntity[];
  attributes: MasterDataAttribute[];
  selectedEntityId: string;
  setSelectedEntityId: (id: string) => void;
  wizardMode?: boolean;
  wizardEntityId?: string | null;
  selectedAttributes: string[];
  onSelectAttribute: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAddAttribute: () => void;
  onEditAttribute: (attr: MasterDataAttribute) => void;
  onDeleteAttribute: (id: string) => void;
  getDataTypeLabel: (type: FieldDataType) => string;
  onSave?: () => void;
  onSaveAndSubmit?: () => void;
  onCancel?: () => void;
  onSubmitAttribute?: (id: string) => void;
  onApproveAttribute?: (id: string) => void;
  onRejectAttribute?: (id: string) => void;
  isViewOnly?: boolean;
}

export function AttributesTab({
  entities,
  attributes,
  selectedEntityId,
  setSelectedEntityId,
  wizardMode = false,
  wizardEntityId,
  selectedAttributes,
  onSelectAttribute,
  onSelectAll,
  onAddAttribute,
  onEditAttribute,
  onDeleteAttribute,
  getDataTypeLabel,
  onSave,
  onSaveAndSubmit,
  onCancel,
  onSubmitAttribute = () => {},
  onApproveAttribute = () => {},
  onRejectAttribute = () => {},
  isViewOnly = false,
}: AttributesTabProps) {
  const currentEntityId = wizardMode ? wizardEntityId : selectedEntityId;
  const currentEntity = entities.find(e => e.id === currentEntityId);

  // Statistics Calculations
  const totalAttributes = attributes.length;
  const requiredAttributes = attributes.filter(a => a.required).length;
  const uniqueAttributes = attributes.filter(a => a.unique).length;

  // UI Local States for Filters & Pagination
  const [showFilters, setShowFilters] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDataType, setFilterDataType] = useState('all');

  // Reset page number on search or filter change
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, filterStatus, filterDataType]);

  // Filter Logic
  const filteredAttributes = attributes.filter(attr => {
    const matchesSearch = attr.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          attr.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attr.status === filterStatus;
    const matchesDataType = filterDataType === 'all' || attr.dataType === filterDataType;
    return matchesSearch && matchesStatus && matchesDataType;
  });

  const paginatedAttributes = filteredAttributes.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalItemsCount);

    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        {/* Left Side: Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>

        {/* Right Side: Page Range and Navigation */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">
            {startItem} - {endItem} / {totalItemsCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Tổng thuộc tính</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalAttributes}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Thuộc tính bắt buộc</span>
            <CheckSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{requiredAttributes}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Thuộc tính duy nhất</span>
            <Tag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{uniqueAttributes}</div>
        </div>
      </div>

      {/* Entity Selector (Only if not in wizard) */}
      {!wizardMode && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-[13px] text-slate-700 mb-1.5 font-medium">
            Chọn thực thể dữ liệu chủ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              title="Chọn thực thể"
              value={selectedEntityId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedEntityId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px] bg-white font-medium appearance-none cursor-pointer"
            >
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.code} - {entity.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Search and Action Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm trường hoặc tên hiển thị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
              />
            </div>
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
            >
              {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {!wizardMode && onSaveAndSubmit && !isViewOnly && (
              <button 
                type="button"
                onClick={onSaveAndSubmit} 
                className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
              >
                Lưu & trình duyệt
              </button>
            )}
            {!isViewOnly && (
              <button
                type="button"
                onClick={onAddAttribute}
                className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                title="Thêm thuộc tính mới"
              >
                <Plus className="w-4 h-4" />
                Thêm thuộc tính
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="relative p-4 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:-top-[7px] before:right-[208px] md:before:right-[auto] md:before:left-[calc(100%-100px)] lg:before:left-[calc(100%-242px)] before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Trạng thái</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Kiểu dữ liệu</label>
                <div className="relative">
                  <select
                    value={filterDataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterDataType(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả kiểu dữ liệu</option>
                    <option value="string">Chuỗi</option>
                    <option value="number">Số</option>
                    <option value="date">Ngày tháng</option>
                    <option value="boolean">Logic</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Managed Entity Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-[13px] text-slate-700">
        <div>
          <span>Đang quản lý thuộc tính của thực thể: </span>
          <span className="font-semibold text-slate-900">{currentEntity?.name || 'Chưa chọn thực thể'}</span>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
              <tr>
                <th className="w-12 px-6 py-4 text-center">
                  <input 
                    type="checkbox" 
                    disabled={isViewOnly}
                    onChange={(e: any) => onSelectAll(e.target.checked)} 
                    checked={attributes.length > 0 && selectedAttributes.length === attributes.length} 
                    className={`rounded border-slate-300 ${isViewOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} 
                    title="Chọn tất cả"
                  />
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên trường</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên hiển thị</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Kiểu dữ liệu</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ràng buộc</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái</th>
                {!isViewOnly && <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right w-48">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedAttributes.length > 0 ? (
                paginatedAttributes.map((attr) => {
                  const isLocked = attr.status === 'approved' || attr.status === 'pending';
                  
                  return (
                    <tr key={attr.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          disabled={isViewOnly}
                          checked={selectedAttributes.includes(attr.id)} 
                          onChange={() => onSelectAttribute(attr.id)} 
                          className={`rounded border-slate-300 ${isViewOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} 
                          title={`Chọn ${attr.fieldName}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-900 font-mono">{attr.fieldName}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-900 font-medium">{attr.displayName}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-700 font-medium">{getDataTypeLabel(attr.dataType)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {attr.required && <span className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                          {attr.unique && <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                          {attr.indexed && <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
                          attr.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                          attr.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {attr.status === 'approved' ? 'Đã duyệt' : attr.status === 'pending' ? 'Chờ duyệt' : 'Bản nháp'}
                        </span>
                      </td>
                      {!isViewOnly && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => onSubmitAttribute(attr.id)}
                              disabled={isLocked}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLocked 
                                  ? 'text-slate-300 cursor-not-allowed bg-transparent' 
                                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
                              }`}
                              title={attr.status === 'approved' ? "Đã duyệt" : (attr.status === 'pending' ? "Đang chờ duyệt" : "Trình duyệt")} 
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            
                            <button
                              onClick={() => onEditAttribute(attr)}
                              disabled={isLocked}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLocked 
                                  ? 'text-slate-300 cursor-not-allowed bg-transparent' 
                                  : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                              }`}
                              title="Sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteAttribute(attr.id)}
                              disabled={isLocked}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLocked 
                                  ? 'text-slate-300 cursor-not-allowed bg-transparent' 
                                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                              }`}
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isViewOnly ? 6 : 7} className="px-6 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Custom Pagination block */}
        {renderPagination(filteredAttributes.length)}
      </div>
    </div>
  );
}
