import { useState, useEffect, type ReactNode } from 'react';
import { Database, Table, Columns, Search, Info, Link2, ArrowLeft, Key, Plus, Save, Trash2, Filter, ArrowUpDown, FileSpreadsheet, RefreshCw, X, Layers, Check, ArrowDown, ArrowUp, Download } from 'lucide-react';
import { toast } from 'sonner';
import { initialTargetDatabases, mockTables, mockColumns, mockTableData } from './mockTargetDatabases';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass, isoToDisplayDate,
  BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, BTN_FOCUS, INPUT_CLS, LABEL_CLS, FIELD_LABEL, FIELD_VALUE,
  SECTION_TITLE, GROUP_TITLE, normalizeSearch,
} from '../collection/collectionUi';

interface TargetDatabaseDetailPageProps {
  databaseId: string;
}

// --- Bảng (compomennt.md 5.3) ---
const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TD = 'px-3 py-1 text-left text-[13px] text-black';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
// Nút bật/tắt trên thanh công cụ: đang mở nền #EAF3FF viền #BFDBFE chữ #155DFC; thường = BTN_OUTLINE
const CHIP_ACTIVE = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFDBFE] bg-[#EAF3FF] text-[#155DFC] text-[13px] font-medium transition-colors ${BTN_FOCUS}`;
const toggleBtnClass = (on: boolean) => (on ? CHIP_ACTIVE : BTN_OUTLINE);
// Nút viền chữ đỏ cho thao tác xóa ngoài bảng
const BTN_OUTLINE_DANGER = `${BTN_OUTLINE} !text-[#DC2626] hover:!bg-[#FEF2F2]`;
// Nút xóa điều kiện lọc/sắp xếp (icon 40×40)
const DEL_ICON_BTN = `w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#DC2626] hover:bg-[#FEF2F2] transition-colors ${BTN_FOCUS}`;

// Giá trị ô dữ liệu: chuỗi ngày ISO hiển thị dd/mm/yyyy (giờ khác 00:00:00 xuống dòng 2) — chỉ đổi khi hiển thị
const renderCellValue = (val: unknown): ReactNode => {
  if (val === null || val === undefined || val === '') return '-';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    const time = /[ T](\d{2}:\d{2}(?::\d{2})?)/.exec(val)?.[1];
    return (
      <>
        <div>{isoToDisplayDate(val)}</div>
        {time && !/^00:00(:00)?$/.test(time) && <div className="text-[#64748B]">{time}</div>}
      </>
    );
  }
  return <TruncatedText text={String(val)} />;
};

export function TargetDatabaseDetailPage({ databaseId }: TargetDatabaseDetailPageProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [editableColumns, setEditableColumns] = useState<any[]>([]);

  const [isRenamingTable, setIsRenamingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableDesc, setNewTableDesc] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [viewMode, setViewMode] = useState<'structure' | 'data'>('structure');

  type FilterItemType = 'condition' | 'group';

  interface FilterCondition {
    id: string;
    type: 'condition';
    field: string;
    operator: string;
    value: string;
    logic: 'AND' | 'OR';
  }

  interface FilterGroup {
    id: string;
    type: 'group';
    logic: 'AND' | 'OR';
    conditions: Omit<FilterCondition, 'type' | 'logic'>[];
  }

  type FilterItem = FilterCondition | FilterGroup;

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterItem[]>([
    { id: '1', type: 'condition', field: 'MaCongDan', operator: '=', value: '', logic: 'AND' }
  ]);

  interface SortCondition {
    id: string;
    field: string;
    order: 'ASC' | 'DESC';
  }
  const [showSort, setShowSort] = useState(false);
  const [sorts, setSorts] = useState<SortCondition[]>([
    { id: '1', field: 'MaCongDan', order: 'DESC' },
    { id: '2', field: 'SoDDCN', order: 'DESC' }
  ]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOption, setExportOption] = useState<'filtered' | 'all'>('filtered');
  const [exportLimit, setExportLimit] = useState('');

  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, string[]>>({});

  const toggleColumn = (col: string) => {
    setHiddenColumns(prev => {
      const currentHidden = prev[selectedTable || ''] || [];
      const newHidden = currentHidden.includes(col)
        ? currentHidden.filter(c => c !== col)
        : [...currentHidden, col];
      return { ...prev, [selectedTable || '']: newHidden };
    });
  };

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showClearDataConfirmModal, setShowClearDataConfirmModal] = useState(false);

  const data = initialTargetDatabases.find(db => db.id === databaseId) || initialTargetDatabases[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [databaseId]);

  useEffect(() => {
    setIsEditingTable(false);
    setIsAddingTable(false);
    setCurrentPage(1);
    setViewMode('structure');
  }, [selectedTable]);

  const handleStartEdit = () => {
    if (!selectedTable) return;
    setIsEditingTable(true);
    setEditableColumns([...(mockColumns[selectedTable] || [])].map(col => ({ ...col })));
  };

  const handleAddColumn = () => {
    setEditableColumns([
      ...editableColumns,
      { name: '', type: 'nvarchar(max)', length: '', decimals: '', notNull: false, isKey: false, description: '' }
    ]);
  };

  const handleDeleteColumn = (index: number) => {
    setEditableColumns(editableColumns.filter((_, idx) => idx !== index));
  };

  const updateColumn = (index: number, field: string, value: any) => {
    const updated = [...editableColumns];
    updated[index] = { ...updated[index], [field]: value };
    setEditableColumns(updated);
  };

  const handleSaveEdit = () => {
    if (selectedTable) {
      mockColumns[selectedTable] = editableColumns;
    }
    setIsEditingTable(false);
  };

  const handleCancelEdit = () => {
    setIsEditingTable(false);
  };

  const handleStartRename = () => {
    if (!selectedTable) return;
    setNewTableName(selectedTable);
    setIsRenamingTable(true);
  };

  const handleSaveRename = () => {
    if (!selectedTable || !newTableName.trim() || selectedTable === newTableName.trim()) {
      setIsRenamingTable(false);
      return;
    }

    const finalName = newTableName.trim();
    const tableIndex = mockTables.findIndex(t => t.name === selectedTable);
    if (tableIndex !== -1) {
      mockTables[tableIndex].name = finalName;
    }

    mockColumns[finalName] = mockColumns[selectedTable];
    delete mockColumns[selectedTable];

    setSelectedTable(finalName);
    setIsRenamingTable(false);
  };

  const handleDeleteTable = () => {
    if (!selectedTable) return;
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDeleteTable = () => {
    if (!selectedTable) return;
    const tableIndex = mockTables.findIndex(t => t.name === selectedTable);
    if (tableIndex !== -1) {
      mockTables.splice(tableIndex, 1);
    }
    delete mockColumns[selectedTable];
    setSelectedTable(null);
    setShowDeleteConfirmModal(false);
  };

  const handleConfirmClearData = () => {
    if (!selectedTable) return;
    mockTableData[selectedTable] = [];
    setShowClearDataConfirmModal(false);
  };

  const handleStartAddTable = () => {
    setSelectedTable(null);
    setIsAddingTable(true);
    setIsEditingTable(true);
    setNewTableName('');
    setNewTableDesc('');
    setEditableColumns([
      { name: 'Id', type: 'int', length: '', decimals: '', notNull: true, isKey: true, description: '' }
    ]);
  };

  const handleSaveAddTable = () => {
    const finalName = newTableName.trim();
    if (!finalName) {
      toast.error('Vui lòng nhập tên bảng');
      return;
    }
    if (mockTables.find(t => t.name.toLowerCase() === finalName.toLowerCase())) {
      toast.error('Tên bảng đã tồn tại');
      return;
    }

    mockTables.push({
      name: finalName,
      description: newTableDesc.trim() || 'Bảng mới tạo'
    });

    mockColumns[finalName] = editableColumns;

    setIsAddingTable(false);
    setIsEditingTable(false);
    setSelectedTable(finalName);
  };

  const handleCancelAddTable = () => {
    setIsAddingTable(false);
    setIsEditingTable(false);
  };

  // Danh sách bảng: lọc ngay khi gõ (không có nút áp dụng), không phân biệt hoa/thường và dấu
  const filteredTables = mockTables.filter(t =>
    normalizeSearch(t.name).includes(normalizeSearch(searchTerm)) ||
    normalizeSearch(t.description).includes(normalizeSearch(searchTerm))
  );

  const allColumns = isEditingTable ? editableColumns : (selectedTable ? mockColumns[selectedTable] || [] : []);
  const dataItems = selectedTable ? mockTableData[selectedTable] || [] : [];

  const totalItems = (viewMode === 'structure' || isAddingTable) ? allColumns.length : dataItems.length;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentColumns = allColumns.slice(startIndex, startIndex + itemsPerPage);
  const currentDataItems = dataItems.slice(startIndex, startIndex + itemsPerPage);

  const handleBack = () => {
    if (typeof (window as any).navigateToPage === 'function') {
      (window as any).navigateToPage('target-database-management');
    } else {
      window.history.back();
    }
  };

  if (!data) return <div className="p-8 text-center text-[13px] text-[#64748B]">Không tìm thấy cơ sở dữ liệu</div>;

  const hiddenOfTable = hiddenColumns[selectedTable || ''] || [];
  const dataKeys = dataItems.length > 0 ? Object.keys(dataItems[0]).filter(key => !hiddenOfTable.includes(key)) : [];
  // Căn lề theo kiểu dữ liệu (mục 5.3.3): cột số căn phải
  const isNumericCol = (key: string) => dataItems.length > 0 && typeof dataItems[0][key] === 'number';
  const fieldOptions = dataItems.length > 0 ? Object.keys(dataItems[0]).map(k => <option key={k} value={k}>{k}</option>) : <option value="">- Chọn trường -</option>;

  // Phân trang dùng chung (compomennt.md 5.14) — giữ lựa chọn 5/10/20/50 như cũ
  const pager = totalItems > 0 && (
    <Pagination
      className="border-t border-[#E2E8F0]"
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={itemsPerPage}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      pageSizeOptions={[5, 10, 20, 50]}
    />
  );

  return (
    <div className="bg-[#F8FAFC] min-h-full p-6 flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Quay lại"
          title="Quay lại"
          className={BTN_GHOST_ICON}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Chi tiết cơ sở dữ liệu đích</h1>
      </div>

      <div className="bg-white rounded-2xl w-full flex flex-col flex-1 border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-medium text-[#020817] leading-6 truncate">{data.name}</h2>
              <p className="text-[13px] text-[#64748B] flex items-center gap-1.5">
                <Link2 className="w-4 h-4" /> {data.type} • {data.host}:{data.port}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden min-h-[600px]">
          {/* Left Panel: Basic Info & Tables */}
          <div className="w-1/3 border-r border-[#E2E8F0] flex flex-col bg-white overflow-y-auto custom-scrollbar">
            {/* Connection Info (Nhãn – Giá trị, mục 5.17) */}
            <div className="p-4">
              <h3 className={SECTION_TITLE}>
                <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                Thông tin kết nối
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1 min-w-0">
                  <div className={FIELD_LABEL}>Schema/Database</div>
                  <div className={`${FIELD_VALUE} break-words`}>{data.schema || '-'}</div>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className={FIELD_LABEL}>Username</div>
                  <div className={`${FIELD_VALUE} break-words`}>{data.username || '-'}</div>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className={FIELD_LABEL}>Ngày tạo</div>
                  <div className={FIELD_VALUE}>20/05/2026</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#EAF3FF] rounded-lg border border-[#BFDBFE] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#155DFC] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#020817] break-words">"{data.note || 'Không có ghi chú'}"</p>
              </div>
            </div>

            {/* Table List Header */}
            <div className="px-4 pt-4 pb-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className={`${SECTION_TITLE} !mb-0`}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Danh sách bảng ({filteredTables.length})
                </h3>
                <button
                  type="button"
                  onClick={handleStartAddTable}
                  className={`${BTN_OUTLINE} !h-8 !px-3`}
                  title="Thêm bảng mới"
                >
                  <Plus className="w-4 h-4" /> Thêm bảng
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                <input
                  type="text"
                  aria-label="Tìm kiếm bảng"
                  placeholder="Tìm kiếm bảng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${INPUT_CLS} pl-9`}
                />
              </div>
            </div>

            {/* Table List Items — đang chọn: nền #EAF3FF, chữ #155DFC, vạch xanh trái */}
            <div className="px-4 pb-4">
              <div className="space-y-1">
                {filteredTables.map((table) => {
                  const active = selectedTable === table.name;
                  return (
                  <button
                    type="button"
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 cursor-pointer ${BTN_FOCUS} ${
                      active
                        ? 'bg-[#EAF3FF] text-[#155DFC] font-medium border-l-4 border-blue-600'
                        : 'text-[#334155] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <Table className={`w-4 h-4 shrink-0 ${active ? 'text-[#155DFC]' : 'text-[#94A3B8]'}`} />
                    <div className="min-w-0 flex-1">
                      <TruncatedText text={table.name} />
                      <TruncatedText text={table.description} className="text-[12px] font-normal text-[#64748B]" />
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Column List */}
          <div className="flex-1 min-w-0 flex flex-col bg-white overflow-y-auto custom-scrollbar">
            {(selectedTable || isAddingTable) ? (
              <>
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4 bg-white sticky top-0 z-10">
                  {isAddingTable ? (
                    <>
                      <div className="flex-1 min-w-0 space-y-2 max-w-xl">
                        <input
                          type="text"
                          aria-label="Tên bảng"
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                          placeholder="Tên bảng (VD: PERSON_INFO)"
                          className={INPUT_CLS}
                          autoFocus
                        />
                        <input
                          type="text"
                          aria-label="Mô tả bảng"
                          value={newTableDesc}
                          onChange={(e) => setNewTableDesc(e.target.value)}
                          placeholder="Nhập mô tả cho bảng"
                          className={INPUT_CLS}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button type="button" onClick={handleAddColumn} className={BTN_OUTLINE}>
                          <Plus className="w-4 h-4" /> Thêm cột
                        </button>
                        <button type="button" onClick={handleCancelAddTable} className={BTN_OUTLINE}>
                          Đóng
                        </button>
                        <button type="button" onClick={handleSaveAddTable} className={BTN_PRIMARY}>
                          <Save className="w-4 h-4" /> Lưu bảng
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="min-w-0">
                        {isRenamingTable ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              aria-label="Tên bảng"
                              value={newTableName}
                              onChange={(e) => setNewTableName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRename(); if (e.key === 'Escape') setIsRenamingTable(false); }}
                              className={`${INPUT_CLS} w-64`}
                              autoFocus
                            />
                            <button type="button" onClick={handleSaveRename} className={BTN_GHOST_ICON} aria-label="Lưu tên" title="Lưu tên">
                              <Save className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => setIsRenamingTable(false)} className={BTN_GHOST_ICON} aria-label="Hủy" title="Hủy">
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h3 className={`${SECTION_TITLE} !mb-0`}>
                            <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                            <span className="truncate">Cấu trúc bảng: {selectedTable}</span>
                          </h3>
                        )}
                        <p className="text-[13px] text-[#64748B] mt-1">Danh sách các trường thông tin trong bảng dữ liệu</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditingTable ? (
                          <>
                            <button type="button" onClick={handleAddColumn} className={BTN_OUTLINE}>
                              <Plus className="w-4 h-4" /> Thêm cột
                            </button>
                            <button type="button" onClick={handleCancelEdit} className={BTN_OUTLINE}>
                              Đóng
                            </button>
                            <button type="button" onClick={handleSaveEdit} className={BTN_PRIMARY}>
                              <Save className="w-4 h-4" /> Lưu
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={handleStartEdit} className={BTN_OUTLINE}>
                              Chỉnh sửa cấu trúc
                            </button>
                            <button type="button" onClick={handleStartRename} className={BTN_OUTLINE}>
                              Đổi tên bảng
                            </button>
                            <button type="button" onClick={handleDeleteTable} className={BTN_OUTLINE_DANGER}>
                              Xóa bảng
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Tab Cấu trúc / Dữ liệu (mục 5.9) */}
                {selectedTable && !isAddingTable && (
                  <div className="border-b border-[#E2E8F0] px-6 flex items-center">
                    <button
                      type="button"
                      onClick={() => { setViewMode('structure'); setCurrentPage(1); }}
                      className={tabClass(viewMode === 'structure')}
                    >
                      Cấu trúc bảng
                    </button>
                    <button
                      type="button"
                      onClick={() => { setViewMode('data'); setCurrentPage(1); }}
                      className={tabClass(viewMode === 'data')}
                    >
                      Dữ liệu bảng
                    </button>
                  </div>
                )}

                <div className="p-6">
                  {viewMode === 'structure' || isAddingTable ? (
                    <div className={TABLE_WRAP}>
                      <div className="overflow-x-auto">
                      <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH.replace('text-left', 'text-center')} w-12`}>#</th>
                          <th className={`${TH} min-w-[150px]`}>Name</th>
                          <th className={`${TH} w-40`}>Type</th>
                          <th className={`${TH.replace('text-left', 'text-right')} w-24`}>Length</th>
                          <th className={`${TH.replace('text-left', 'text-right')} w-28`}>Decimals</th>
                          <th className={`${TH.replace('text-left', 'text-center')} w-24`}>Not null</th>
                          <th className={`${TH.replace('text-left', 'text-center')} w-16`}>Key</th>
                          <th className={TH}>Comment</th>
                          {isEditingTable && (
                            <th className={`${TH.replace('text-left', 'text-center')} w-16`}>Xóa</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {currentColumns.map((col, relativeIdx) => {
                          const idx = startIndex + relativeIdx;
                          return (
                          <tr key={idx} className={TR}>
                            <td className={`${TD.replace('text-left', 'text-center')} whitespace-nowrap`}>{idx + 1}</td>
                            <td className={`${TD} max-w-[240px]`}>
                              {isEditingTable ? (
                                <input type="text" aria-label="Tên cột" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} className={INPUT_CLS} placeholder="Tên cột" />
                              ) : <TruncatedText text={col.name || '-'} />}
                            </td>
                            <td className={TD}>
                              {isEditingTable ? (
                                <select aria-label="Type" value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} className={INPUT_CLS}>
                                  <option value="int">int</option>
                                  <option value="varchar">varchar</option>
                                  <option value="nvarchar(max)">nvarchar(max)</option>
                                  <option value="DATE">DATE</option>
                                  <option value="VARCHAR2">VARCHAR2</option>
                                  <option value="NVARCHAR2">NVARCHAR2</option>
                                  <option value="NUMBER">NUMBER</option>
                                </select>
                              ) : (
                                <Badge label={col.type} variant="slate" />
                              )}
                            </td>
                            <td className={`${TD.replace('text-left', 'text-right')} tabular-nums whitespace-nowrap`}>
                              {isEditingTable ? (
                                <input type="text" aria-label="Length" value={col.length || ''} onChange={(e) => updateColumn(idx, 'length', e.target.value)} className={INPUT_CLS} />
                              ) : (col.length || '-')}
                            </td>
                            <td className={`${TD.replace('text-left', 'text-right')} tabular-nums whitespace-nowrap`}>
                              {isEditingTable ? (
                                <input type="text" aria-label="Decimals" value={col.decimals || ''} onChange={(e) => updateColumn(idx, 'decimals', e.target.value)} className={INPUT_CLS} />
                              ) : (col.decimals || '-')}
                            </td>
                            <td className={TD.replace('text-left', 'text-center')}>
                              {isEditingTable ? (
                                <input type="checkbox" aria-label="Not null" checked={col.notNull || false} onChange={(e) => updateColumn(idx, 'notNull', e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer align-middle" />
                              ) : (
                                col.notNull !== undefined ? (
                                  <input type="checkbox" aria-label="Not null" checked={col.notNull} readOnly className="w-4 h-4 accent-blue-600 cursor-default align-middle" />
                                ) : '-'
                              )}
                            </td>
                            <td className={TD.replace('text-left', 'text-center')}>
                              {isEditingTable ? (
                                <input type="checkbox" aria-label="Key" checked={col.isKey || false} onChange={(e) => updateColumn(idx, 'isKey', e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer align-middle" />
                              ) : (
                                col.isKey && <Key className="w-4 h-4 text-[#D97706] mx-auto" />
                              )}
                            </td>
                            <td className={`${TD} max-w-[320px]`}>
                              {isEditingTable ? (
                                <input type="text" aria-label="Comment" value={col.description || ''} onChange={(e) => updateColumn(idx, 'description', e.target.value)} className={INPUT_CLS} />
                              ) : <TruncatedText text={col.description || '-'} />}
                            </td>
                            {isEditingTable && (
                              <td className={`${TD.replace('text-left', 'text-center')} whitespace-nowrap`}>
                                <RowIconAction label="Xóa cột này" onClick={() => handleDeleteColumn(idx)}>
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
                              </td>
                            )}
                          </tr>
                        )})}
                      </tbody>
                    </table>
                      </div>
                      {pager}
                  </div>
                  ) : (
                  <div className="flex flex-col">
                    {/* Thanh công cụ dữ liệu */}
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button type="button" aria-expanded={showFilter} onClick={() => { setShowFilter(!showFilter); setShowSort(false); }} className={toggleBtnClass(showFilter)}>
                          <Filter className="w-4 h-4" /> Lọc
                        </button>
                        <button type="button" aria-expanded={showSort} onClick={() => { setShowSort(!showSort); setShowFilter(false); }} className={toggleBtnClass(showSort)}>
                          <ArrowUpDown className="w-4 h-4" /> Sắp xếp
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowExportModal(true)}
                          className={BTN_OUTLINE}
                        >
                          <FileSpreadsheet className="w-4 h-4" /> Xuất excel
                        </button>
                        {/* Ẩn/Hiện cột: danh sách cột mở dạng popover (giữ state showColumnToggle / hiddenColumns) */}
                        <Popover open={showColumnToggle} onOpenChange={setShowColumnToggle}>
                          <PopoverTrigger asChild>
                            <button type="button" className={toggleBtnClass(showColumnToggle)}>
                              <Columns className="w-4 h-4" /> Ẩn/Hiện cột
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={6} className="w-64 p-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg">
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                              {dataItems.length > 0 && Object.keys(dataItems[0]).map(col => {
                                const isHidden = hiddenOfTable.includes(col);
                                return (
                                  <label key={col} className="flex items-center gap-2 h-9 px-3 rounded-md cursor-pointer hover:bg-[#F8FAFC]">
                                    <input
                                      type="checkbox"
                                      checked={!isHidden}
                                      onChange={() => toggleColumn(col)}
                                      className="w-4 h-4 shrink-0 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="text-[13px] text-[#020817] truncate">{col}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowClearDataConfirmModal(true)}
                          className={BTN_OUTLINE_DANGER}
                        >
                          <Trash2 className="w-4 h-4" /> Xóa dữ liệu
                        </button>
                        <button type="button" className={BTN_OUTLINE}>
                          <RefreshCw className="w-4 h-4" /> Tải lại
                        </button>
                      </div>
                    </div>

                    {showFilter && (
                      <div className="mb-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                        <div className="flex flex-col gap-2">
                          {filters.map((f, i) => {
                            if (f.type === 'condition') {
                              return (
                                <div key={f.id} className="flex items-center gap-2">
                                  {i > 0 && (
                                    <div className="w-24 shrink-0">
                                      <select
                                        aria-label="AND / OR"
                                        value={f.logic}
                                        onChange={(e) => {
                                          const newF = [...filters];
                                          (newF[i] as FilterCondition).logic = e.target.value as 'AND' | 'OR';
                                          setFilters(newF);
                                        }}
                                        className={INPUT_CLS}
                                      >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                      </select>
                                    </div>
                                  )}
                                  <div className={i === 0 ? 'flex-1 max-w-xs' : 'flex-1 max-w-[216px]'}>
                                    <select
                                      aria-label="Trường"
                                      value={f.field}
                                      onChange={(e) => {
                                        const newF = [...filters];
                                        (newF[i] as FilterCondition).field = e.target.value;
                                        setFilters(newF);
                                      }}
                                      className={INPUT_CLS}
                                    >
                                      {fieldOptions}
                                    </select>
                                  </div>
                                  <div className="w-40 shrink-0">
                                    <select
                                      aria-label="Toán tử"
                                      value={f.operator}
                                      onChange={(e) => {
                                        const newF = [...filters];
                                        (newF[i] as FilterCondition).operator = e.target.value;
                                        setFilters(newF);
                                      }}
                                      className={INPUT_CLS}
                                    >
                                      <option value="=">Bằng (=)</option>
                                      <option value="!=">Khác (!=)</option>
                                      <option value="LIKE">Chứa</option>
                                      <option value=">">Lớn hơn (&gt;)</option>
                                      <option value="<">Nhỏ hơn (&lt;)</option>
                                    </select>
                                  </div>
                                  <div className="flex-1 relative">
                                    <input
                                      type="text"
                                      aria-label="Giá trị"
                                      value={f.value}
                                      onChange={(e) => {
                                        const newF = [...filters];
                                        (newF[i] as FilterCondition).value = e.target.value;
                                        setFilters(newF);
                                      }}
                                      placeholder="<?>"
                                      className={INPUT_CLS}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    aria-label="Xóa điều kiện"
                                    onClick={() => {
                                      const newF = filters.filter(item => item.id !== f.id);
                                      if (newF.length === 0) {
                                        setFilters([{ id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                                      } else {
                                        setFilters(newF);
                                      }
                                    }}
                                    className={DEL_ICON_BTN}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            } else {
                              // FilterGroup rendering
                              return (
                                <div key={f.id} className="border border-[#E2E8F0] p-3 rounded-lg bg-white relative flex flex-col gap-2">
                                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-l-lg"></div>
                                  <div className="flex items-center justify-between ml-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-24 shrink-0">
                                        <select
                                          aria-label="AND / OR"
                                          value={f.logic}
                                          onChange={(e) => {
                                            const newF = [...filters];
                                            (newF[i] as FilterGroup).logic = e.target.value as 'AND' | 'OR';
                                            setFilters(newF);
                                          }}
                                          className={INPUT_CLS}
                                        >
                                          <option value="AND">AND</option>
                                          <option value="OR">OR</option>
                                        </select>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newF = [...filters];
                                          (newF[i] as FilterGroup).conditions.push({
                                            id: Date.now().toString(),
                                            field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '',
                                            operator: '=',
                                            value: ''
                                          });
                                          setFilters(newF);
                                        }}
                                        className={BTN_OUTLINE}
                                      >
                                        <Plus className="w-4 h-4" /> Thêm điều kiện
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      aria-label="Xóa nhóm điều kiện"
                                      onClick={() => {
                                        const newF = filters.filter(item => item.id !== f.id);
                                        if (newF.length === 0) {
                                          setFilters([{ id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                                        } else {
                                          setFilters(newF);
                                        }
                                      }}
                                      className={DEL_ICON_BTN}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="flex flex-col gap-2 ml-2">
                                    {f.conditions.map((c, j) => (
                                      <div key={c.id} className="flex items-center gap-2">
                                        <div className="flex-1 max-w-[216px]">
                                          <select
                                            aria-label="Trường"
                                            value={c.field}
                                            onChange={(e) => {
                                              const newF = [...filters];
                                              (newF[i] as FilterGroup).conditions[j].field = e.target.value;
                                              setFilters(newF);
                                            }}
                                            className={INPUT_CLS}
                                          >
                                            {fieldOptions}
                                          </select>
                                        </div>
                                        <div className="w-40 shrink-0">
                                          <select
                                            aria-label="Toán tử"
                                            value={c.operator}
                                            onChange={(e) => {
                                              const newF = [...filters];
                                              (newF[i] as FilterGroup).conditions[j].operator = e.target.value;
                                              setFilters(newF);
                                            }}
                                            className={INPUT_CLS}
                                          >
                                            <option value="=">Bằng (=)</option>
                                            <option value="!=">Khác (!=)</option>
                                            <option value="LIKE">Chứa</option>
                                            <option value=">">Lớn hơn (&gt;)</option>
                                            <option value="<">Nhỏ hơn (&lt;)</option>
                                          </select>
                                        </div>
                                        <div className="flex-1 relative">
                                          <input
                                            type="text"
                                            aria-label="Giá trị"
                                            value={c.value}
                                            onChange={(e) => {
                                              const newF = [...filters];
                                              (newF[i] as FilterGroup).conditions[j].value = e.target.value;
                                              setFilters(newF);
                                            }}
                                            placeholder="<?>"
                                            className={INPUT_CLS}
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          aria-label="Xóa điều kiện"
                                          onClick={() => {
                                            const newF = [...filters];
                                            (newF[i] as FilterGroup).conditions = (newF[i] as FilterGroup).conditions.filter((_, idx) => idx !== j);
                                            setFilters(newF);
                                          }}
                                          className={DEL_ICON_BTN}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                          })}

                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFilters([...filters, { id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                              }}
                              className={BTN_OUTLINE}
                            >
                              <Plus className="w-4 h-4" /> Điều kiện
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFilters([
                                  ...filters,
                                  {
                                    id: Date.now().toString(),
                                    type: 'group',
                                    logic: 'AND',
                                    conditions: [
                                      { id: Date.now().toString() + '_1', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '' }
                                    ]
                                  }
                                ]);
                              }}
                              className={BTN_OUTLINE}
                            >
                              <Layers className="w-4 h-4" /> Gom Nhóm
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2 pt-4 border-t border-[#E2E8F0]">
                            <button type="button" className={BTN_PRIMARY}>
                              <Check className="w-4 h-4" /> Áp dụng
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFilters([{ id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                              }}
                              className={BTN_OUTLINE}
                            >
                              <X className="w-4 h-4" /> Xóa bộ lọc
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {showSort && (
                      <div className="mb-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                        <div className="flex flex-col gap-2">
                          {sorts.map((s, i) => (
                            <div key={s.id} className="flex items-center gap-2">
                              <div className="flex-1">
                                <select
                                  aria-label="Trường"
                                  value={s.field}
                                  onChange={(e) => {
                                    const newS = [...sorts];
                                    newS[i].field = e.target.value;
                                    setSorts(newS);
                                  }}
                                  className={INPUT_CLS}
                                >
                                  {fieldOptions}
                                </select>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newS = [...sorts];
                                  newS[i].order = newS[i].order === 'ASC' ? 'DESC' : 'ASC';
                                  setSorts(newS);
                                }}
                                className={`${BTN_OUTLINE} flex-1`}
                              >
                                {s.order === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                {s.order}
                              </button>
                              <button
                                type="button"
                                aria-label="Xóa điều kiện"
                                onClick={() => {
                                  const newS = sorts.filter(item => item.id !== s.id);
                                  if (newS.length === 0) {
                                    setSorts([{ id: Date.now().toString(), field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', order: 'DESC' }]);
                                  } else {
                                    setSorts(newS);
                                  }
                                }}
                                className={DEL_ICON_BTN}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          <div className="flex items-center mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSorts([...sorts, { id: Date.now().toString(), field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', order: 'DESC' }]);
                              }}
                              className={BTN_OUTLINE}
                            >
                              <Plus className="w-4 h-4" /> Điều kiện
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2 pt-4 border-t border-[#E2E8F0]">
                            <button type="button" className={BTN_PRIMARY}>
                              <Check className="w-4 h-4" /> Áp dụng
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSorts([{ id: Date.now().toString(), field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', order: 'DESC' }]);
                              }}
                              className={BTN_OUTLINE}
                            >
                              <X className="w-4 h-4" /> Xóa sắp xếp
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bảng dữ liệu (compomennt.md 5.3) */}
                    <div className={TABLE_WRAP}>
                      <div className="overflow-x-auto">
                      <table className="w-full border-collapse collection-table text-[13px]">
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            {dataItems.length > 0 ? (
                              dataKeys.map(key => (
                                  <th key={key} className={isNumericCol(key) ? TH.replace('text-left', 'text-right') : TH}>
                                    {key}
                                  </th>
                              ))
                            ) : (
                               <th className={TH.replace('text-left', 'text-center')}>Dữ liệu</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {currentDataItems.length > 0 ? (
                            currentDataItems.map((row, rowIdx) => (
                              <tr key={rowIdx} className={TR}>
                                {Object.entries(row)
                                  .filter(([colKey]) => !hiddenOfTable.includes(colKey))
                                  .map(([colKey, val], colIdx) => (
                                    <td
                                      key={colIdx}
                                      className={typeof val === 'number'
                                        ? `${TD.replace('text-left', 'text-right')} tabular-nums whitespace-nowrap`
                                        : `${TD} max-w-[240px] leading-[18px] whitespace-nowrap`}
                                    >
                                      {typeof val === 'number' ? val : renderCellValue(val)}
                                    </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={100} className="py-16 text-center text-[13px] text-[#64748B]">
                                <div className="flex flex-col items-center justify-center">
                                  <Search className="w-8 h-8 text-[#CBD5E1] mb-2" />
                                  <p>Bảng chưa có dữ liệu</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      </div>
                      {pager}
                    </div>
                  </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
                  <Table className="w-8 h-8 text-[#CBD5E1]" />
                </div>
                <h4 className={`${GROUP_TITLE} mb-1`}>Chưa chọn bảng dữ liệu</h4>
                <p className="max-w-xs text-[13px] text-[#64748B]">
                  Vui lòng chọn một bảng từ danh sách bên trái để xem chi tiết cấu trúc các cột dữ liệu.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (mục 5.4) — bấm nền để đóng như cũ */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirmModal(false)}></div>
          <div role="alertdialog" aria-modal="true" aria-labelledby="tddp-delete-title" className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 id="tddp-delete-title" className="flex-1 min-w-0 text-[16px] font-medium text-[#020817] leading-6">Xác nhận xóa bảng</h3>
              <button type="button" onClick={() => setShowDeleteConfirmModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="bg-[#F8FAFC] rounded-lg p-4 text-[13px] text-[#020817] leading-5 border border-[#E2E8F0]">
                Bạn có chắc chắn muốn xóa bảng <span className="font-medium">"{selectedTable}"</span>? Toàn bộ dữ liệu của bảng cũng sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button type="button" onClick={() => setShowDeleteConfirmModal(false)} className={BTN_OUTLINE}>
                Hủy bỏ
              </button>
              <button type="button" onClick={handleConfirmDeleteTable} className={BTN_DESTRUCTIVE}>
                Xóa bảng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal (mục 5.4) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div role="dialog" aria-modal="true" aria-labelledby="tddp-export-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E2E8F0]">
              <h3 id="tddp-export-title" className="text-[16px] font-medium text-[#020817] leading-6">Xuất dữ liệu</h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                aria-label="Đóng"
                title="Đóng"
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
              <div className="bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-3 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#155DFC] shrink-0" />
                <span className="text-[13px] text-[#020817] truncate">Tên bảng: <span className="font-medium">{selectedTable}</span></span>
              </div>

              <div className="mb-4">
                <div className={`${FIELD_LABEL} mb-2`}>Tùy chọn xuất dữ liệu</div>

                <div className="space-y-3">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="exportOption"
                      value="filtered"
                      checked={exportOption === 'filtered'}
                      onChange={() => setExportOption('filtered')}
                      className="w-4 h-4 mt-0.5 shrink-0 accent-blue-600 cursor-pointer"
                    />
                    <div>
                      <div className="text-[13px] font-medium text-[#020817] group-hover:text-blue-600 transition-colors">Xuất dữ liệu đã lọc</div>
                      <div className="text-[12px] text-[#64748B] mt-0.5">Xuất dữ liệu theo điều kiện lọc & sắp xếp hiện tại</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="exportOption"
                      value="all"
                      checked={exportOption === 'all'}
                      onChange={() => setExportOption('all')}
                      className="w-4 h-4 mt-0.5 shrink-0 accent-blue-600 cursor-pointer"
                    />
                    <div>
                      <div className="text-[13px] font-medium text-[#020817] group-hover:text-blue-600 transition-colors">Xuất tất cả dữ liệu</div>
                      <div className="text-[12px] text-[#64748B] mt-0.5">Bỏ qua bộ lọc, xuất toàn bộ collection</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="tddp-export-limit" className={LABEL_CLS}>Giới hạn số dòng <span className="text-[#64748B] font-normal">(tùy chọn)</span></label>
                <input
                  id="tddp-export-limit"
                  type="number"
                  value={exportLimit}
                  onChange={(e) => setExportLimit(e.target.value)}
                  placeholder="Để trống để xuất tất cả"
                  className={INPUT_CLS}
                />
                <p className="text-[12px] text-[#D97706] mt-1">Khuyến nghị: Tối đa 10,000 dòng để tránh timeout</p>
              </div>

              <div className="p-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] space-y-1.5">
                <div className="flex items-center justify-between text-[13px] text-[#020817]">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-[#64748B]" />
                    <span className="font-medium">Điều kiện lọc:</span>
                  </div>
                  <span className="text-[#155DFC] font-medium tabular-nums">{filters.length > 0 && filters[0].value ? filters.length : 0} điều kiện</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-[#020817]">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-4 h-4 text-[#64748B]" />
                    <span className="font-medium">Sắp xếp:</span>
                  </div>
                  <span className="text-[#155DFC] font-medium tabular-nums">{sorts.length > 0 && sorts[0].field ? sorts.length : 0} điều kiện</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  // Implement actual export logic here
                }}
                className={BTN_PRIMARY}
              >
                <Download className="w-4 h-4" /> Thực hiện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirm Modal (mục 5.4) */}
      {showClearDataConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div role="alertdialog" aria-modal="true" aria-labelledby="tddp-clear-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 id="tddp-clear-title" className="flex-1 min-w-0 text-[16px] font-medium text-[#020817] leading-6">Xác nhận xóa dữ liệu</h3>
              <button type="button" onClick={() => setShowClearDataConfirmModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="bg-[#F8FAFC] rounded-lg p-4 text-[13px] text-[#020817] leading-5 border border-[#E2E8F0]">
                Bạn có chắc chắn muốn xóa toàn bộ dữ liệu của bảng <span className="font-medium">"{selectedTable}"</span>? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button type="button" onClick={() => setShowClearDataConfirmModal(false)} className={BTN_OUTLINE}>
                Hủy bỏ
              </button>
              <button type="button" onClick={handleConfirmClearData} className={BTN_DESTRUCTIVE}>
                Xóa dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
