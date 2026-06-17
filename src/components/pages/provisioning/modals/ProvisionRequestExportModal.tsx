import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, FileDown, CheckCircle, Table as TableIcon, Filter, AlertCircle, RefreshCw, Layers, Database, LayoutTemplate, Key, Trash2, Plus, Copy, Code } from 'lucide-react';

// Mock Database Schema for Civil Registry
const mockSchema: Record<string, string[]> = {
  'ho_tich_ca_nhan': ['id', 'ma_vinh_vien', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dinh_danh'],
  'giay_khai_sinh': ['id', 'so_giay_khai_sinh', 'ngay_dang_ky', 'noi_sinh', 'ho_ten_cha', 'ho_ten_me'],
  'dia_chi_thuong_tru': ['id', 'user_id', 'id_ho_tich', 'tinh_thanh', 'quan_huyen', 'phuong_xa', 'chi_tiet'],
  'thong_tin_cha_me': ['id', 'id_ho_tich', 'ho_ten_cha', 'cccd_cha', 'ho_ten_me', 'cccd_me']
};
const tableNames = Object.keys(mockSchema);

interface ProvisionRequestExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: any;
  onConfirmExport: (id: string) => void;
}

export function ProvisionRequestExportModal({ isOpen, onClose, requestData, onConfirmExport }: ProvisionRequestExportModalProps) {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState(requestData?.format || 'excel');

  // States for query mode
  const [queryMode, setQueryMode] = useState<'visual' | 'raw_sql'>('visual');
  const [rawSql, setRawSql] = useState('SELECT *\nFROM ho_tich_ca_nhan\nWHERE id = :id');

  // States for query builder
  const [dateColumn, setDateColumn] = useState('');
  const [conditions, setConditions] = useState<any[]>([]);

  // States for packet design
  const [fields, setFields] = useState<any[]>([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'id' },
    { id: 2, name: 'ho_ten', type: 'string', description: 'Họ và tên', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'ho_ten' },
    { id: 3, name: 'so_dinh_danh', type: 'string', description: 'Số định danh cá nhân', isMasked: true, maskRule: 'hide_middle_4', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'so_dinh_danh' }
  ]);
  const [hasJoin, setHasJoin] = useState(false);
  const [primaryTable, setPrimaryTable] = useState('ho_tich_ca_nhan');
  const [joinedTables, setJoinedTables] = useState<any[]>([
    { id: 1, name: 'dia_chi_thuong_tru', alias: 't2', type: 'LEFT JOIN', joinColA: 't2.id_ho_tich', joinOp: '=', joinColB: 'ho_tich_ca_nhan.id' }
  ]);

  const handleAddJoinTable = () => {
    const nextId = joinedTables.length > 0 ? Math.max(...joinedTables.map(t => t.id)) + 1 : 1;
    const nextAlias = `t${nextId + 1}`;
    setJoinedTables([
      ...joinedTables,
      { id: nextId, name: '', alias: nextAlias, type: 'LEFT JOIN', joinColA: '', joinOp: '=', joinColB: '' }
    ]);
  };

  const handleRemoveJoinTable = (id: number) => {
    setJoinedTables(joinedTables.filter(t => t.id !== id));
  };

  const handleUpdateJoinTable = (id: number, key: string, value: string) => {
    setJoinedTables(joinedTables.map(t => t.id === id ? { ...t, [key]: value } : t));
  };

  const handleAddDataField = () => {
    const nextId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    setFields([
      ...fields,
      {
        id: nextId,
        name: '',
        type: 'string',
        description: '',
        isMasked: false,
        maskRule: '',
        sourceTable: primaryTable,
        sourceColumn: '',
        isCalculated: false
      }
    ]);
  };

  const handleUpdateFieldProperty = (id: any, property: string, value: any) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const updated = { ...f, [property]: value };
        if (property === 'sourceColumn') {
          updated.name = value;
          const tbl = updated.sourceTable || primaryTable;
          const col = value;
          updated.description = `Trường ${col} (từ bảng ${tbl})`;
          if (col.toLowerCase().includes('ngay') || col.toLowerCase().includes('thoi_gian') || col.toLowerCase().includes('date')) {
            updated.type = 'datetime';
          } else if (col === 'id' || col.toLowerCase().includes('so') || col.toLowerCase().includes('ma') || col.toLowerCase().includes('cccd')) {
            updated.type = 'string';
          } else {
            updated.type = 'string';
          }
        }
        return updated;
      }
      return f;
    }));
  };

  const handleDeleteField = (id: any) => {
    setFields(fields.filter(f => f.id !== id));
  };

  if (!isOpen || !requestData) return null;

  const handleNextStep = () => {
    setActiveStep(2);
  };

  const handleConfirm = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onConfirmExport(requestData.id);
      onClose();
    }, 1500);
  };

  const mockPreviewData = [
    { id: '1', so_dinh_danh: '001095000123', ho_ten: 'Nguyễn Văn A', ngay_sinh: '15/10/1995', tinh_trang: 'Đã kết hôn' },
    { id: '2', so_dinh_danh: '001096000456', ho_ten: 'Trần Thị B', ngay_sinh: '22/05/1996', tinh_trang: 'Đã kết hôn' },
    { id: '3', so_dinh_danh: '001098000789', ho_ten: 'Lê Văn C', ngay_sinh: '08/11/1998', tinh_trang: 'Độc thân' },
  ];

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 transition-all">
      <div className="bg-white rounded-2xl w-full max-w-5xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-emerald-600" />
              Kết xuất dữ liệu theo yêu cầu
            </h2>
            <div className="flex items-center gap-3 mt-1.5 text-sm">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{requestData.id}</span>
              <span className="text-slate-500 font-medium">Đơn vị: <strong className="text-slate-700">{requestData.org}</strong></span>
              <span className="text-slate-500 font-medium">Dữ liệu: <strong className="text-slate-700">{requestData.dataType}</strong></span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar - Steps */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 shrink-0">
            <div className="flex flex-col gap-4 relative before:absolute before:left-5 before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200">
              {/* Step 1 */}
              <div className="relative flex gap-4 z-10 cursor-pointer" onClick={() => setActiveStep(1)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${activeStep === 1 ? 'bg-blue-600 border-blue-600 text-white shadow-md' : activeStep > 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-300 text-slate-400'}`}>
                  {activeStep > 1 ? <CheckCircle className="w-5 h-5" /> : 1}
                </div>
                <div className="pt-2.5">
                  <h3 className={`text-sm font-bold ${activeStep === 1 ? 'text-blue-600' : 'text-slate-700'}`}>Thiết lập tiêu chí</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lọc dữ liệu truy xuất</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex gap-4 z-10 cursor-pointer" onClick={() => activeStep >= 1 && setActiveStep(2)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${activeStep === 2 ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}>
                  2
                </div>
                <div className="pt-2.5">
                  <h3 className={`text-sm font-bold ${activeStep === 2 ? 'text-blue-600' : 'text-slate-700'}`}>Xem trước & Xuất</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kiểm tra và tạo file</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-start gap-2 text-blue-600 mb-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Mục đích yêu cầu</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                "{requestData.purpose}"
              </p>
            </div>
          </div>

          {/* Right Main Area */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            
            {activeStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Mode Toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-max border border-slate-200 shadow-inner">
                  <button
                    onClick={() => setQueryMode('visual')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${queryMode === 'visual' ? 'bg-white text-blue-600 shadow border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    Cấu hình trực quan (Visual)
                  </button>
                  <button
                    onClick={() => setQueryMode('raw_sql')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${queryMode === 'raw_sql' ? 'bg-white text-blue-600 shadow border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    Viết câu lệnh (Raw SQL)
                  </button>
                </div>

                {queryMode === 'visual' ? (
                  <>
                    <section>
                  <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Thiết lập điều kiện truy xuất
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Cột thời gian</label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-medium text-slate-700"
                        value={dateColumn}
                        onChange={(e) => setDateColumn(e.target.value)}
                      >
                        <option value="">-- Chọn mốc thời gian --</option>
                        <optgroup label={`Bảng chính: ${primaryTable}`}>
                          {mockSchema[primaryTable]?.map(col => (
                            <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                          ))}
                        </optgroup>
                        {hasJoin && joinedTables.map(t => t.name && (
                          <optgroup key={t.id} label={`Liên kết: ${t.alias}`}>
                            {mockSchema[t.name]?.map(col => (
                               <option key={`${t.alias}.${col}`} value={`${t.alias}.${col}`}>{t.alias}.{col}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Từ ngày</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-700" defaultValue={requestData.fromDate || ''} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Đến ngày</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-700" defaultValue={requestData.toDate || ''} />
                    </div>
                  </div>

                  {/* Visual Query Builder */}
                  <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <Filter className="w-4 h-4 text-blue-500" />
                        Điều kiện lọc bổ sung
                      </h4>
                      <button
                        type="button"
                        onClick={() => setConditions([...conditions, { id: Date.now(), logicalOp: 'AND', column: '', operator: '=', value: '' }])}
                        className="text-[10px] font-bold bg-white hover:bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors flex items-center gap-1 shadow-sm cursor-pointer uppercase tracking-wider"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm điều kiện
                      </button>
                    </div>
                    
                    <div className="p-4 bg-white space-y-3">
                      {conditions.length === 0 ? (
                        <div className="text-center py-6 text-sm text-slate-400 italic bg-slate-50/50 rounded-lg border border-slate-100 border-dashed">
                          Chưa có điều kiện lọc bổ sung nào. Nhấn "Thêm điều kiện" để thiết lập.
                        </div>
                      ) : (
                        conditions.map((cond, idx) => (
                          <div key={cond.id} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg group animate-in fade-in zoom-in-95 duration-200">
                            {idx === 0 ? (
                              <div className="text-xs font-mono font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-20 text-center">
                                WHERE
                              </div>
                            ) : (
                              <select
                                className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-200 outline-none focus:border-blue-500 cursor-pointer w-20 text-center"
                                value={cond.logicalOp || 'AND'}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].logicalOp = e.target.value;
                                  setConditions(newConds);
                                }}
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            )}
                            <div className="flex-1 w-full flex items-center gap-3">
                              <select 
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500 font-mono"
                                value={cond.column}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].column = e.target.value;
                                  setConditions(newConds);
                                }}
                              >
                                <option value="">-- Chọn trường --</option>
                                <optgroup label={`Bảng chính: ${primaryTable}`}>
                                  {mockSchema[primaryTable]?.map(col => (
                                    <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                                  ))}
                                </optgroup>
                                {hasJoin && joinedTables.map(t => t.name && (
                                  <optgroup key={t.id} label={`Liên kết: ${t.alias}`}>
                                    {mockSchema[t.name]?.map(col => (
                                       <option key={`${t.alias}.${col}`} value={`${t.alias}.${col}`}>{t.alias}.{col}</option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                              
                              <select 
                                className="w-32 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-sm font-bold text-blue-700 outline-none focus:border-blue-500 text-center"
                                value={cond.operator}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].operator = e.target.value;
                                  setConditions(newConds);
                                }}
                              >
                                <option value="=">Bằng (=)</option>
                                <option value=">">Lớn hơn (&gt;)</option>
                                <option value="<">Nhỏ hơn (&lt;)</option>
                                <option value="LIKE">Chứa (LIKE)</option>
                                <option value="IN">Trong (IN)</option>
                                <option value="IS NULL">Rỗng (IS NULL)</option>
                                <option value="!=">Khác (!=)</option>
                              </select>
                              
                              <input 
                                type="text" 
                                placeholder="Giá trị lọc..." 
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                                value={cond.value}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].value = e.target.value;
                                  setConditions(newConds);
                                }}
                                disabled={cond.operator === 'IS NULL'}
                              />
                              
                              <button
                                type="button"
                                onClick={() => setConditions(conditions.filter(c => c.id !== cond.id))}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa điều kiện"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
                
                 {/* Data Source Configuration */}
                 <section className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-5">
                     <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                          <Database className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Cấu hình Nguồn dữ liệu</h4>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Sử dụng liên kết bảng (Join)</span>
                        <div 
                          onClick={() => setHasJoin(!hasJoin)}
                          className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-all duration-300 ${hasJoin ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${hasJoin ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                   </div>

                    <div className="grid grid-cols-1 gap-5">
                      {/* Primary Table */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all group/table">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                           <span>Bảng dữ liệu chính</span>
                           <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded italic">Primary Table</span>
                        </label>
                        <select 
                          title="Chọn bảng chính" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 outline-none cursor-pointer"
                          value={primaryTable}
                          onChange={(e) => setPrimaryTable(e.target.value)}
                        >
                          <option value="ho_tich_ca_nhan" className="text-slate-800">ho_tich_ca_nhan (Hộ tịch cá nhân)</option>
                          <option value="giay_khai_sinh" className="text-slate-800">giay_khai_sinh (Giấy khai sinh)</option>
                        </select>
                      </div>

                      {/* Joined Tables Builder */}
                      {hasJoin && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Database className="w-3.5 h-3.5 text-blue-600" />
                              Bảng liên kết bổ sung ({joinedTables.length})
                            </h5>
                            <button
                              type="button"
                              onClick={handleAddJoinTable}
                              className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 transition-all flex items-center shadow-sm cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm bảng liên kết
                            </button>
                          </div>

                          {joinedTables.map((table, idx) => (
                            <div key={table.id} className="p-4 bg-white border border-slate-200 rounded-xl relative space-y-4 hover:border-blue-300 transition-all">
                              <button
                                type="button"
                                onClick={() => handleRemoveJoinTable(table.id)}
                                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa bảng liên kết"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded">
                                  BẢNG LIÊN KẾT #{idx + 1}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                  Alias: {table.alias}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kiểu liên kết</label>
                                  <select 
                                    aria-label="Kiểu liên kết" 
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={table.type}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'type', e.target.value)}
                                  >
                                    <option>INNER JOIN</option>
                                    <option>LEFT JOIN</option>
                                    <option>RIGHT JOIN</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bảng dữ liệu bổ sung</label>
                                  <select 
                                    title="Chọn bảng phụ" 
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={table.name}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'name', e.target.value)}
                                  >
                                    <option value="">-- Chọn bảng bổ sung --</option>
                                    {tableNames.filter(name => name !== primaryTable).map(name => (
                                      <option key={name} value={name}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {table.name && (
                                <div className="p-3 bg-blue-50/20 rounded-lg border border-blue-100 border-dashed space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                  <div className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Điều kiện liên kết (Join Condition):</div>
                                  <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full">
                                      <select 
                                        title="Trường PK" 
                                        className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                                        value={table.joinColA}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColA', e.target.value)}
                                      >
                                        <option value="">-- Cột của {table.name} --</option>
                                        {mockSchema[table.name]?.map(col => (
                                          <option key={col} value={`${table.alias}.${col}`}>{table.alias}.{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs px-2.5 py-1 bg-blue-50 rounded border border-blue-100 shadow-sm">=</div>
                                    <div className="flex-1 w-full">
                                      <select 
                                        title="Trường FK" 
                                        className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                                        value={table.joinColB}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColB', e.target.value)}
                                      >
                                        <option value="">-- Nối với cột --</option>
                                        <optgroup label={`Bảng chính: ${primaryTable}`}>
                                          {mockSchema[primaryTable]?.map(col => (
                                            <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                                          ))}
                                        </optgroup>
                                        {joinedTables.slice(0, idx).map(prevTable => prevTable.name && (
                                          <optgroup key={prevTable.id} label={`Bảng liên kết: ${prevTable.name} (${prevTable.alias})`}>
                                            {mockSchema[prevTable.name]?.map(col => (
                                              <option key={`${prevTable.alias}.${col}`} value={`${prevTable.alias}.${col}`}>{prevTable.alias}.{col}</option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 </section>

                  {/* Field Definition Table */}
                  <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50/50">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-blue-600" />
                        Chọn trường dữ liệu chia sẻ (Field Selection)
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddDataField}
                        className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 transition-all flex items-center shadow-sm cursor-pointer"
                        title="Thêm trường dữ liệu gốc"
                      >
                        <Plus className="w-4 h-4 mr-1.5" /> Thêm trường dữ liệu
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-12">Chia sẻ</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-12">PK</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[20%]">Nguồn dữ liệu (Table)</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[22%]">Trường gốc (Column)</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[22%]">Tên trường (API Field)</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[14%]">Kiểu dữ liệu</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-[10%]">Che dấu</th>
                            <th className="px-4 py-3 w-16 text-right">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {fields.map(field => (
                              <tr key={field.id} className="hover:bg-slate-50/50 group transition-colors">
                                <td className="px-4 py-3 text-center">
                                  <input type="checkbox" title="Chọn trường" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" defaultChecked />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Key className={`w-4 h-4 mx-auto ${field.id === 1 ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500 transition-colors cursor-pointer'}`} />
                                </td>
                                <td className="px-4 py-3">
                                  <select 
                                    title="Chọn bảng" 
                                    className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px] font-bold text-slate-700 outline-none cursor-pointer focus:border-blue-500 shadow-sm"
                                    value={field.sourceTable || primaryTable}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'sourceTable', e.target.value)}
                                  >
                                    <option value={primaryTable}>{primaryTable} (Gốc)</option>
                                    {hasJoin && joinedTables.map(t => t.name && (
                                      <option key={t.id} value={t.name}>{t.name} (Liên kết)</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <select 
                                    title="Chọn cột nguồn" 
                                    className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px] font-mono text-slate-600 outline-none cursor-pointer focus:border-blue-500 shadow-sm"
                                    value={field.sourceColumn || ''}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'sourceColumn', e.target.value)}
                                  >
                                    <option value="">-- Chọn trường gốc --</option>
                                    {mockSchema[field.sourceTable || primaryTable]?.map(col => (
                                      <option key={col} value={col}>{col}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <input 
                                    title="Tên trường API" 
                                    aria-label="Tên trường API" 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-2 py-1 rounded outline-none text-xs text-slate-800 font-mono font-bold shadow-sm" 
                                    value={field.name} 
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'name', e.target.value)}
                                    placeholder="Ví dụ: ho_ten"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <select 
                                    title="Kiểu" 
                                    className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-500 outline-none uppercase cursor-pointer focus:border-blue-500 shadow-sm"
                                    value={field.type}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'type', e.target.value)}
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="datetime">datetime</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    title="Masking" 
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" 
                                    checked={field.isMasked || false} 
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'isMasked', e.target.checked)}
                                  />
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteField(field.id)}
                                    className="p-1 text-slate-400 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                                    title="Xóa trường"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  </>
                ) : (
                  <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-500" />
                      Câu lệnh SQL tùy chỉnh
                    </h3>
                    <textarea
                      value={rawSql}
                      onChange={(e) => setRawSql(e.target.value)}
                      className="w-full h-64 p-4 font-mono text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y shadow-inner"
                      placeholder="SELECT * FROM ho_tich_ca_nhan WHERE id = :id"
                    />
                  </section>
                )}

                {/* Live JSON Preview */}
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300 relative mt-6">
                    <div className="flex justify-between items-center p-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <h4 className="font-bold text-slate-500 text-sm tracking-wide">Live API Response Preview</h4>
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors shadow-sm">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5 overflow-x-auto">
                      <pre className="text-sm font-mono leading-loose text-slate-400/90">
                        <code className="text-slate-400">{`{`}</code>{'\n'}
                        <code className="text-slate-400">  "status": "success",</code>{'\n'}
                        <code className="text-slate-400">  "data": {`{`}</code>{'\n'}
                        {fields.filter(f => f.name).map((f) => (
                          <React.Fragment key={f.id}>
                            <code className="text-slate-400">    "{f.name}": </code>
                            {f.type === 'number' ? (
                              <code className="text-slate-400/80">12345</code>
                            ) : f.type === 'datetime' ? (
                              <code className="text-slate-400/80">"2026-10-15T08:30:00Z"</code>
                            ) : (
                              <code className="text-slate-400/80">"{f.isMasked ? '001••••123' : `sample_${f.sourceColumn || f.name}`}"</code>
                            )}
                            <code className="text-slate-400">,</code>{'\n'}
                          </React.Fragment>
                        ))}
                        <code className="text-slate-400">    "metadata": {`{`}</code>{'\n'}
                        <code className="text-slate-400">      "source": "BTP_DLDC_CORE",</code>{'\n'}
                        {(() => {
                           const filtersString = conditions.filter(c => c.column).map((c, i) => {
                             const prefix = i === 0 ? '' : ` ${c.logicalOp || 'AND'} `;
                             return `${prefix}${c.column} ${c.operator} ${c.operator === 'IS NULL' ? '' : `'${c.value}'`}`;
                           }).join('').trim();
                           return filtersString ? (
                             <>
                               <code className="text-slate-400">      "query_filters": "{filtersString}",</code>{'\n'}
                             </>
                           ) : null;
                        })()}
                        <code className="text-slate-400">      "timestamp": "2026-06-02T16:21:10.607Z"</code>{'\n'}
                        <code className="text-slate-400">    {`}`}</code>{'\n'}
                        <code className="text-slate-400">  {`}`}</code>{'\n'}
                        <code className="text-slate-400">{`}`}</code>
                      </pre>
                    </div>
                  </section>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div className="flex items-center gap-4 text-emerald-700">
                    <TableIcon className="w-8 h-8 opacity-80" />
                    <div>
                      <h4 className="font-bold text-sm">Dữ liệu sẵn sàng kết xuất</h4>
                      <p className="text-xs mt-0.5 opacity-80">Dự kiến: <strong className="font-bold text-emerald-800">12,450</strong> bản ghi khớp với điều kiện.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Định dạng file:</span>
                    <select 
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="xml">XML (.xml)</option>
                    </select>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bản xem trước dữ liệu (Top 3)</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="px-4 py-2 font-medium">Số định danh</th>
                          <th className="px-4 py-2 font-medium">Họ tên</th>
                          <th className="px-4 py-2 font-medium">Ngày sinh</th>
                          <th className="px-4 py-2 font-medium">Tình trạng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPreviewData.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-mono text-slate-600">{row.so_dinh_danh}</td>
                            <td className="px-4 py-2.5 font-medium text-slate-800">{row.ho_ten}</td>
                            <td className="px-4 py-2.5 text-slate-600">{row.ngay_sinh}</td>
                            <td className="px-4 py-2.5 text-slate-600">{row.tinh_trang}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors uppercase tracking-widest"
          >
            Hủy bỏ
          </button>
          
          <div className="flex items-center gap-3">
            {activeStep === 1 && (
              <button 
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors uppercase tracking-widest"
              >
                Tiếp tục
              </button>
            )}
            {activeStep === 2 && (
              <>
                <button 
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors uppercase tracking-widest"
                >
                  Quay lại
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-md transition-all uppercase tracking-widest flex items-center gap-2 min-w-[160px] justify-center"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang tạo file...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      Xác nhận kết xuất
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  , document.body);
}
