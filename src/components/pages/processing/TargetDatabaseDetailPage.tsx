import { useState, useEffect } from 'react';
import { Database, Table, Columns, Search, ChevronRight, Info, Link2, ShieldCheck, Calendar, ArrowLeft, Key, Plus, Save, Edit2, Trash2, Filter, ArrowUpDown, FileSpreadsheet, RefreshCw, X, Layers, Check, ArrowDown, ArrowUp, Download } from 'lucide-react';
import { initialTargetDatabases, mockTables, mockColumns, mockTableData } from './mockTargetDatabases';

interface TargetDatabaseDetailPageProps {
  databaseId: string;
}

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
      alert('Vui lòng nhập tên bảng');
      return;
    }
    if (mockTables.find(t => t.name.toLowerCase() === finalName.toLowerCase())) {
      alert('Tên bảng đã tồn tại');
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

  const filteredTables = mockTables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allColumns = isEditingTable ? editableColumns : (selectedTable ? mockColumns[selectedTable] || [] : []);
  const dataItems = selectedTable ? mockTableData[selectedTable] || [] : [];
  
  const totalItems = (viewMode === 'structure' || isAddingTable) ? allColumns.length : dataItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
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

  if (!data) return <div className="p-8 text-center text-slate-500">Không tìm thấy cơ sở dữ liệu</div>;

  return (
    <div className="bg-[#f8f9fa] min-h-full p-6 flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="mb-6 flex items-center">
        <button 
          onClick={handleBack}
          className="mr-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Chi tiết cơ sở dữ liệu đích</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm w-full flex flex-col flex-1 border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-2xl font-bold text-slate-800">{data.name}</h2>
              </div>
              <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                <Link2 className="w-4 h-4" /> {data.type} • {data.host}:{data.port}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden min-h-[600px]">
          {/* Left Panel: Basic Info & Tables */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-y-auto">
            {/* Connection Info */}
            <div className="p-6">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Thông tin kết nối
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[13px] text-slate-500">Schema/Database</span>
                  <span className="text-[13px] font-semibold text-slate-800">{data.schema}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[13px] text-slate-500">Username</span>
                  <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> {data.username}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[13px] text-slate-500">Ngày tạo</span>
                  <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> 20/05/2026
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-[13px] text-blue-700 italic">"{data.note || 'Không có ghi chú'}"</p>
              </div>
            </div>

            {/* Table List Header */}
            <div className="px-6 py-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 m-0">
                  <Table className="w-3.5 h-3.5" /> Danh sách bảng ({filteredTables.length})
                </h3>
                <button 
                  onClick={handleStartAddTable}
                  className="px-2 py-1 text-[13px] font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center gap-1 transition-colors"
                  title="Thêm bảng mới"
                >
                  <Plus className="w-3 h-3" /> Thêm bảng
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bảng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Table List Items */}
            <div className="px-4 pb-6">
              <div className="space-y-1">
                {filteredTables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                      selectedTable === table.name
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Table className={`w-4 h-4 flex-shrink-0 ${selectedTable === table.name ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <div className="text-left overflow-hidden">
                        <p className={`text-[13px] font-bold truncate ${selectedTable === table.name ? 'text-white' : 'text-slate-800'}`}>
                          {table.name}
                        </p>
                        <p className={`text-[10px] truncate ${selectedTable === table.name ? 'text-blue-100' : 'text-slate-400'}`}>
                          {table.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      selectedTable === table.name ? 'text-white translate-x-0.5' : 'text-slate-300'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Column List */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            {(selectedTable || isAddingTable) ? (
              <>
                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
                  {isAddingTable ? (
                    <>
                      <div className="flex items-start gap-4 flex-1 mr-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                          <Table className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <input 
                              type="text" 
                              value={newTableName} 
                              onChange={(e) => setNewTableName(e.target.value)}
                              placeholder="Tên bảng (VD: PERSON_INFO)"
                              className="w-full text-lg font-bold text-slate-800 border-b-2 border-blue-500 focus:outline-none bg-transparent px-1 py-1"
                              autoFocus
                            />
                          </div>
                          <div>
                            <input 
                              type="text" 
                              value={newTableDesc} 
                              onChange={(e) => setNewTableDesc(e.target.value)}
                              placeholder="Nhập mô tả cho bảng"
                              className="w-full text-[13px] text-slate-600 border-b border-transparent focus:border-blue-500 hover:border-slate-200 focus:outline-none bg-transparent px-1 py-1 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={handleAddColumn}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded text-[13px] font-medium hover:bg-emerald-100 flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Thêm cột
                        </button>
                        <button 
                          onClick={handleCancelAddTable}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-[13px] font-medium hover:bg-slate-200"
                        >
                          Đóng
                        </button>
                        <button 
                          onClick={handleSaveAddTable}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" /> Lưu bảng
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Columns className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          {isRenamingTable ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                value={newTableName} 
                                onChange={(e) => setNewTableName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRename(); if (e.key === 'Escape') setIsRenamingTable(false); }}
                                className="text-lg font-bold text-slate-800 border-b-2 border-blue-500 focus:outline-none bg-transparent px-1"
                                autoFocus
                              />
                              <button onClick={handleSaveRename} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Lưu tên">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={() => setIsRenamingTable(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded" title="Hủy">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <h3 className="text-lg font-bold text-slate-800">Cấu trúc bảng: {selectedTable}</h3>
                          )}
                          <p className="text-[13px] text-slate-500">Danh sách các trường thông tin trong bảng dữ liệu</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditingTable ? (
                          <>
                            <button 
                              onClick={handleAddColumn}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded text-[13px] font-medium hover:bg-emerald-100 flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" /> Thêm cột
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-[13px] font-medium hover:bg-slate-200"
                            >
                              Đóng
                            </button>
                            <button 
                              onClick={handleSaveEdit}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 flex items-center gap-1.5"
                            >
                              <Save className="w-4 h-4" /> Lưu
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={handleStartEdit}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-100 flex items-center gap-1.5"
                            >
                              Chỉnh sửa cấu trúc
                            </button>
                            <button 
                              onClick={handleStartRename}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-100 flex items-center gap-1.5"
                            >
                              Đổi tên bảng
                            </button>
                            <button 
                              onClick={handleDeleteTable}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-[13px] font-medium hover:bg-red-100 flex items-center gap-1.5"
                            >
                              Xóa bảng
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {selectedTable && !isAddingTable && (
                  <div className="bg-slate-50/50 border-b border-slate-200 px-6 flex items-center gap-6">
                    <button 
                      onClick={() => { setViewMode('structure'); setCurrentPage(1); }}
                      className={`text-[13px] font-bold py-3 border-b-2 transition-colors ${viewMode === 'structure' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      Cấu trúc bảng
                    </button>
                    <button 
                      onClick={() => { setViewMode('data'); setCurrentPage(1); }}
                      className={`text-[13px] font-bold py-3 border-b-2 transition-colors ${viewMode === 'data' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      Dữ liệu bảng
                    </button>
                  </div>
                )}
                
                <div className="p-6">
                  {viewMode === 'structure' || isAddingTable ? (
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider w-12 text-center">#</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider min-w-[150px]">Name</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider w-40">Type</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider w-24">Length</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider w-28">Decimals</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center w-24">Not null</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center w-16">Key</th>
                          <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Comment</th>
                          {isEditingTable && (
                            <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center w-16">Xóa</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentColumns.map((col, relativeIdx) => {
                          const idx = startIndex + relativeIdx;
                          return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 text-[13px] text-slate-500 text-center">{idx + 1}</td>
                            <td className="py-3 px-4 text-[13px] font-bold text-slate-800">
                              {isEditingTable ? (
                                <input type="text" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-[13px] focus:border-blue-500 focus:outline-none font-normal" placeholder="Tên cột" />
                              ) : col.name}
                            </td>
                            <td className="py-3 px-4">
                              {isEditingTable ? (
                                <select value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-[13px] focus:border-blue-500 focus:outline-none bg-white">
                                  <option value="int">int</option>
                                  <option value="varchar">varchar</option>
                                  <option value="nvarchar(max)">nvarchar(max)</option>
                                  <option value="DATE">DATE</option>
                                  <option value="VARCHAR2">VARCHAR2</option>
                                  <option value="NVARCHAR2">NVARCHAR2</option>
                                  <option value="NUMBER">NUMBER</option>
                                </select>
                              ) : (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[13px] font-bold uppercase border border-slate-200">
                                  {col.type}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-[13px] text-slate-500">
                              {isEditingTable ? (
                                <input type="text" value={col.length || ''} onChange={(e) => updateColumn(idx, 'length', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-[13px] focus:border-blue-500 focus:outline-none" />
                              ) : (col.length || '')}
                            </td>
                            <td className="py-3 px-4 text-[13px] text-slate-500">
                              {isEditingTable ? (
                                <input type="text" value={col.decimals || ''} onChange={(e) => updateColumn(idx, 'decimals', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-[13px] focus:border-blue-500 focus:outline-none" />
                              ) : (col.decimals || '')}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isEditingTable ? (
                                <input type="checkbox" checked={col.notNull || false} onChange={(e) => updateColumn(idx, 'notNull', e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                              ) : (
                                col.notNull !== undefined ? (
                                  <input type="checkbox" checked={col.notNull} readOnly className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-default" />
                                ) : ''
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isEditingTable ? (
                                <input type="checkbox" checked={col.isKey || false} onChange={(e) => updateColumn(idx, 'isKey', e.target.checked)} className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer" />
                              ) : (
                                col.isKey && <Key className="w-4 h-4 text-amber-500 mx-auto" />
                              )}
                            </td>
                            <td className="py-3 px-4 text-[13px] text-slate-600">
                              {isEditingTable ? (
                                <input type="text" value={col.description || ''} onChange={(e) => updateColumn(idx, 'description', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-[13px] focus:border-blue-500 focus:outline-none" />
                              ) : col.description}
                            </td>
                            {isEditingTable && (
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteColumn(idx)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa cột này">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                  ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between bg-slate-50 p-2 border border-slate-200 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setShowFilter(!showFilter); setShowSort(false); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded transition-colors ${showFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                          <Filter className="w-3.5 h-3.5" /> Lọc
                        </button>
                        <button onClick={() => { setShowSort(!showSort); setShowFilter(false); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded transition-colors ${showSort ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                          <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp
                        </button>
                        <button 
                          onClick={() => setShowExportModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium bg-white text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất excel
                        </button>
                        <button 
                          onClick={() => setShowColumnToggle(!showColumnToggle)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded transition-colors ${showColumnToggle ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                        >
                          <Columns className="w-3.5 h-3.5" /> Ẩn/Hiện cột
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setShowClearDataConfirmModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa dữ liệu
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium bg-white text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" /> Tải lại
                        </button>
                      </div>
                    </div>

                    {showFilter && (
                      <div className="mb-4 border border-slate-200 bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col gap-3">
                          {filters.map((f, i) => {
                            if (f.type === 'condition') {
                              return (
                                <div key={f.id} className="flex items-center gap-3">
                                  {i > 0 && (
                                    <select 
                                      value={f.logic}
                                      onChange={(e) => {
                                        const newF = [...filters];
                                        (newF[i] as FilterCondition).logic = e.target.value as 'AND' | 'OR';
                                        setFilters(newF);
                                      }}
                                      className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-24 focus:outline-none focus:border-blue-500 bg-white"
                                    >
                                      <option value="AND">AND</option>
                                      <option value="OR">OR</option>
                                    </select>
                                  )}
                                  <select 
                                    value={f.field}
                                    onChange={(e) => {
                                      const newF = [...filters];
                                      (newF[i] as FilterCondition).field = e.target.value;
                                      setFilters(newF);
                                    }}
                                    className={`px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500 bg-white ${i === 0 ? 'flex-1 max-w-xs' : 'flex-1 max-w-[216px]'}`}
                                  >
                                    {dataItems.length > 0 ? Object.keys(dataItems[0]).map(k => <option key={k} value={k}>{k}</option>) : <option value="">- Chọn trường -</option>}
                                  </select>
                                  <select 
                                    value={f.operator}
                                    onChange={(e) => {
                                      const newF = [...filters];
                                      (newF[i] as FilterCondition).operator = e.target.value;
                                      setFilters(newF);
                                    }}
                                    className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-40 focus:outline-none focus:border-blue-500 bg-white"
                                  >
                                    <option value="=">Bằng (=)</option>
                                    <option value="!=">Khác (!=)</option>
                                    <option value="LIKE">Chứa</option>
                                    <option value=">">Lớn hơn (&gt;)</option>
                                    <option value="<">Nhỏ hơn (&lt;)</option>
                                  </select>
                                  <div className="flex-1 relative">
                                    <input 
                                      type="text" 
                                      value={f.value}
                                      onChange={(e) => {
                                        const newF = [...filters];
                                        (newF[i] as FilterCondition).value = e.target.value;
                                        setFilters(newF);
                                      }}
                                      placeholder="<?>"
                                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const newF = filters.filter(item => item.id !== f.id);
                                      if (newF.length === 0) {
                                        setFilters([{ id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                                      } else {
                                        setFilters(newF);
                                      }
                                    }}
                                    className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            } else {
                              // FilterGroup rendering
                              return (
                                <div key={f.id} className="border border-red-500/50 p-3 rounded bg-white relative flex flex-col gap-3">
                                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-l"></div>
                                  <div className="flex items-center justify-between ml-2">
                                    <div className="flex items-center gap-2">
                                      <select 
                                        value={f.logic}
                                        onChange={(e) => {
                                          const newF = [...filters];
                                          (newF[i] as FilterGroup).logic = e.target.value as 'AND' | 'OR';
                                          setFilters(newF);
                                        }}
                                        className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-24 focus:outline-none focus:border-blue-500 bg-white"
                                      >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                      </select>
                                      <button 
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
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 bg-white transition-colors"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> Thêm điều kiện
                                      </button>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        const newF = filters.filter(item => item.id !== f.id);
                                        if (newF.length === 0) {
                                          setFilters([{ id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                                        } else {
                                          setFilters(newF);
                                        }
                                      }}
                                      className="p-1.5 border border-red-200 bg-white text-red-500 rounded hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  <div className="flex flex-col gap-3 ml-2">
                                    {f.conditions.map((c, j) => (
                                      <div key={c.id} className="flex items-center gap-3">
                                        <select 
                                          value={c.field}
                                          onChange={(e) => {
                                            const newF = [...filters];
                                            (newF[i] as FilterGroup).conditions[j].field = e.target.value;
                                            setFilters(newF);
                                          }}
                                          className="flex-1 max-w-[216px] px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500 bg-white"
                                        >
                                          {dataItems.length > 0 ? Object.keys(dataItems[0]).map(k => <option key={k} value={k}>{k}</option>) : <option value="">- Chọn trường -</option>}
                                        </select>
                                        <select 
                                          value={c.operator}
                                          onChange={(e) => {
                                            const newF = [...filters];
                                            (newF[i] as FilterGroup).conditions[j].operator = e.target.value;
                                            setFilters(newF);
                                          }}
                                          className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-40 focus:outline-none focus:border-blue-500 bg-white"
                                        >
                                          <option value="=">Bằng (=)</option>
                                          <option value="!=">Khác (!=)</option>
                                          <option value="LIKE">Chứa</option>
                                          <option value=">">Lớn hơn (&gt;)</option>
                                          <option value="<">Nhỏ hơn (&lt;)</option>
                                        </select>
                                        <div className="flex-1 relative">
                                          <input 
                                            type="text" 
                                            value={c.value}
                                            onChange={(e) => {
                                              const newF = [...filters];
                                              (newF[i] as FilterGroup).conditions[j].value = e.target.value;
                                              setFilters(newF);
                                            }}
                                            placeholder="<?>"
                                            className="w-full px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500"
                                          />
                                        </div>
                                        <button 
                                          onClick={() => {
                                            const newF = [...filters];
                                            (newF[i] as FilterGroup).conditions = (newF[i] as FilterGroup).conditions.filter((_, idx) => idx !== j);
                                            setFilters(newF);
                                          }}
                                          className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
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
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => {
                                setFilters([...filters, { id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" /> Điều kiện
                            </button>
                            <button 
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
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors"
                            >
                              <Layers className="w-4 h-4" /> Gom Nhóm
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors">
                              <Check className="w-4 h-4" /> Áp dụng
                            </button>
                            <button 
                              onClick={() => {
                                setFilters([{ id: Date.now().toString(), type: 'condition', field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', operator: '=', value: '', logic: 'AND' }]);
                              }}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              <X className="w-4 h-4" /> Xóa bộ lọc
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {showSort && (
                      <div className="mb-4 border border-slate-200 bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col gap-3">
                          {sorts.map((s, i) => (
                            <div key={s.id} className="flex items-center gap-3">
                              <select 
                                value={s.field}
                                onChange={(e) => {
                                  const newS = [...sorts];
                                  newS[i].field = e.target.value;
                                  setSorts(newS);
                                }}
                                className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500 bg-white"
                              >
                                {dataItems.length > 0 ? Object.keys(dataItems[0]).map(k => <option key={k} value={k}>{k}</option>) : <option value="">- Chọn trường -</option>}
                              </select>
                              <button 
                                onClick={() => {
                                  const newS = [...sorts];
                                  newS[i].order = newS[i].order === 'ASC' ? 'DESC' : 'ASC';
                                  setSorts(newS);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-300 bg-slate-100 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-200 transition-colors"
                              >
                                {s.order === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                {s.order}
                              </button>
                              <button 
                                onClick={() => {
                                  const newS = sorts.filter(item => item.id !== s.id);
                                  if (newS.length === 0) {
                                    setSorts([{ id: Date.now().toString(), field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', order: 'DESC' }]);
                                  } else {
                                    setSorts(newS);
                                  }
                                }}
                                className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => {
                                setSorts([...sorts, { id: Date.now().toString(), field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', order: 'DESC' }]);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" /> Điều kiện
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors">
                              <Check className="w-4 h-4" /> Áp dụng
                            </button>
                            <button 
                              onClick={() => {
                                setSorts([{ id: Date.now().toString(), field: dataItems.length > 0 ? Object.keys(dataItems[0])[0] : '', order: 'DESC' }]);
                              }}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              <X className="w-4 h-4" /> Xóa sắp xếp
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="flex items-start">
                    {showColumnToggle && (
                      <div className="w-56 border-r border-slate-200 pr-4 mr-4 shrink-0 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {dataItems.length > 0 && Object.keys(dataItems[0]).map(col => {
                           const isHidden = (hiddenColumns[selectedTable || ''] || []).includes(col);
                           return (
                             <label key={col} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 px-2 rounded">
                               <input 
                                 type="checkbox" 
                                 checked={!isHidden}
                                 onChange={() => toggleColumn(col)}
                                 className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                               />
                               <span className="text-[13px] font-medium text-slate-700 truncate" title={col}>{col}</span>
                             </label>
                           );
                        })}
                      </div>
                    )}
                    
                    <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            {dataItems.length > 0 ? (
                              Object.keys(dataItems[0])
                                .filter(key => !(hiddenColumns[selectedTable || ''] || []).includes(key))
                                .map(key => (
                                  <th key={key} className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                                    {key}
                                  </th>
                              ))
                            ) : (
                               <th className="py-3 px-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center">Dữ liệu</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentDataItems.length > 0 ? (
                            currentDataItems.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                                {Object.entries(row)
                                  .filter(([colKey]) => !(hiddenColumns[selectedTable || ''] || []).includes(colKey))
                                  .map(([colKey, val], colIdx) => (
                                    <td key={colIdx} className="py-3 px-4 text-[13px] text-slate-800">
                                      {val as any}
                                    </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={100} className="py-12 text-center text-slate-500 text-[13px]">
                                <div className="flex flex-col items-center justify-center">
                                  <Search className="w-8 h-8 text-slate-300 mb-2" />
                                  <p>Bảng chưa có dữ liệu</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </div>
                  )}

                  {/* Pagination */}
                  {totalItems > 0 && (
                    <div className="mt-4 flex items-center justify-between text-[13px] max-w-full flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Hiển thị</span>
                        <div className="relative">
                          <select 
                            value={itemsPerPage} 
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                        </div>
                        <span className="text-slate-500">bản ghi / trang</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">
                          {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} / {totalItems}
                        </span>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 border border-slate-200 rounded-md ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed bg-slate-50' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                          >
                            Trước
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .map((p, i, arr) => (
                              <div key={p} className="flex gap-1">
                                {i > 0 && p - arr[i - 1] > 1 && (
                                  <span className="px-2 py-1.5 text-slate-400">...</span>
                                )}
                                <button
                                  onClick={() => setCurrentPage(p)}
                                  className={`px-3 py-1.5 border rounded-md ${
                                    currentPage === p 
                                      ? 'border-blue-600 bg-blue-600 text-white font-medium' 
                                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  {p}
                                </button>
                              </div>
                            ))}
                          
                          <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 border border-slate-200 rounded-md ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed bg-slate-50' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                          >
                            Sau
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 animate-pulse">
                  <Table className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Chưa chọn bảng dữ liệu</h4>
                <p className="max-w-xs text-[13px] text-slate-500">
                  Vui lòng chọn một bảng từ danh sách bên trái để xem chi tiết cấu trúc các cột dữ liệu.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirmModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Xác nhận xóa bảng</h3>
              <p className="text-slate-600 text-center text-[13px] mb-6">
                Bạn có chắc chắn muốn xóa bảng <span className="font-bold text-slate-800">"{selectedTable}"</span>? Toàn bộ dữ liệu của bảng cũng sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleConfirmDeleteTable}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Xóa bảng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-3 bg-blue-600 text-white">
              <h3 className="text-[13px] font-bold">Xuất dữ liệu</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-blue-50/80 border border-blue-100 rounded-lg p-2.5 mb-5 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-[13px] font-medium text-blue-900 truncate">Tên bảng: <span className="font-bold">{selectedTable}</span></span>
              </div>
              
              <div className="mb-5">
                <h4 className="text-[13px] font-semibold text-slate-800 mb-2.5">Tùy chọn xuất dữ liệu</h4>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <div className="flex items-center h-4 mt-0.5">
                      <input 
                        type="radio" 
                        name="exportOption" 
                        value="filtered"
                        checked={exportOption === 'filtered'}
                        onChange={() => setExportOption('filtered')}
                        className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Xuất dữ liệu đã lọc</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Xuất dữ liệu theo điều kiện lọc & sắp xếp hiện tại</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <div className="flex items-center h-4 mt-0.5">
                      <input 
                        type="radio" 
                        name="exportOption" 
                        value="all"
                        checked={exportOption === 'all'}
                        onChange={() => setExportOption('all')}
                        className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Xuất tất cả dữ liệu</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Bỏ qua bộ lọc, xuất toàn bộ collection</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mb-5">
                <h4 className="text-[13px] font-semibold text-slate-800 mb-2">Giới hạn số dòng <span className="text-slate-400 font-normal">(tùy chọn)</span></h4>
                <input 
                  type="number"
                  value={exportLimit}
                  onChange={(e) => setExportLimit(e.target.value)}
                  placeholder="Để trống để xuất tất cả"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[11px] text-amber-600 mt-1.5">Khuyến nghị: Tối đa 10,000 dòng để tránh timeout</p>
              </div>
              
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/80 space-y-1.5">
                <div className="flex items-center justify-between text-[13px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold">Điều kiện lọc:</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{filters.length > 0 && filters[0].value ? filters.length : 0} điều kiện</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold">Sắp xếp:</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{sorts.length > 0 && sorts[0].field ? sorts.length : 0} điều kiện</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end items-center gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-3 py-1.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setShowExportModal(false);
                  // Implement actual export logic here
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Thực hiện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirm Modal */}
      {showClearDataConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Xác nhận xóa dữ liệu</h3>
              <p className="text-slate-600 text-center text-[13px] mb-6">
                Bạn có chắc chắn muốn xóa toàn bộ dữ liệu của bảng <span className="font-bold text-slate-800">"{selectedTable}"</span>? Thao tác này không thể hoàn tác.
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowClearDataConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleConfirmClearData}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Xóa dữ liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
