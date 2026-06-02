import React, { useState } from 'react';
import { X, Check, Database, Plus, Trash2, Code, Key, Copy, LayoutTemplate, FileText } from 'lucide-react';

interface ProvisionApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData?: any;
  onSave?: (data: any) => void;
}

type TabType = 'general' | 'packet';

// Mock Database Schema for Civil Registry
const mockSchema: Record<string, string[]> = {
  'ho_tich_ca_nhan': ['id', 'ma_vinh_vien', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dinh_danh'],
  'giay_khai_sinh': ['id', 'so_giay_khai_sinh', 'ngay_dang_ky', 'noi_sinh', 'ho_ten_cha', 'ho_ten_me'],
  'dia_chi_thuong_tru': ['id', 'user_id', 'id_ho_tich', 'tinh_thanh', 'quan_huyen', 'phuong_xa', 'chi_tiet'],
  'thong_tin_cha_me': ['id', 'id_ho_tich', 'ho_ten_cha', 'cccd_cha', 'ho_ten_me', 'cccd_me']
};
const tableNames = Object.keys(mockSchema);

export function ProvisionApiModal({ isOpen, onClose, apiData, onSave }: ProvisionApiModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isNdxpEnabled, setIsNdxpEnabled] = useState(false);

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

  if (!isOpen) return null;

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'packet' as TabType, label: 'Thiết kế cấu trúc gói tin', icon: <LayoutTemplate className="w-4 h-4" /> },
  ];

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

  const generateDynamicPreview = () => {
    const dataObj: any = {};
    fields.forEach(f => {
      if (f.isCalculated) {
        if (f.type === 'number') {
          dataObj[f.name] = 42;
        } else if (f.type === 'boolean') {
          dataObj[f.name] = true;
        } else if (f.type === 'datetime') {
          dataObj[f.name] = "2026-05-28T13:45:00Z";
        } else {
          dataObj[f.name] = f.formula ? `Computed: ${f.formula.substring(0, 20)}` : "Computed Value";
        }
      } else {
        const colName = f.sourceColumn || f.name || 'id';
        if (colName === 'id') {
          dataObj[f.name || 'id'] = "USR-99812";
        } else if (colName === 'ho_ten') {
          dataObj[f.name || 'ho_ten'] = "Nguyễn Văn A";
        } else if (colName === 'ngay_sinh') {
          dataObj[f.name || 'ngay_sinh'] = "1995-10-15";
        } else if (colName === 'gioi_tinh') {
          dataObj[f.name || 'gioi_tinh'] = 1;
        } else if (colName === 'so_dinh_danh') {
          dataObj[f.name || 'so_dinh_danh'] = f.isMasked ? "001••••123" : "001095000123";
        } else {
          dataObj[f.name || colName] = f.type === 'number' ? 100 : `Dữ liệu trường [${colName}]`;
        }
      }
    });

    const fullResponse = {
      status: "success",
      data: {
        ...dataObj,
        metadata: {
          source: "BTP_DLDC_CORE",
          timestamp: new Date().toISOString()
        }
      }
    };
    return JSON.stringify(fullResponse, null, 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: apiData?.name || 'API Mới',
        endpoint: apiData?.endpoint || '/api/v1/new',
        method: apiData?.method || 'GET',
        version: apiData?.version || 'v1.0'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/50 backdrop-blur-sm transition-all duration-300 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex flex-1 overflow-hidden relative">
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Sidebar Navigation */}
          <div className="w-64 border-r border-slate-200 bg-slate-50/50 p-6 flex flex-col gap-4 shrink-0">
            <div className="mb-6 px-2">
               <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">
                  {apiData ? 'Cập nhật API' : 'Thêm mới API'}
               </h2>
               <p className="text-[9px] text-slate-500 mt-1.5 uppercase font-bold tracking-widest">API Provisioning Engine</p>
            </div>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group uppercase tracking-wider ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 ring-1 ring-blue-100/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 border-l-4 border-transparent'
                }`}
              >
                <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors duration-300`}>
                  {tab.icon}
                </span>
                <span className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-700 group-hover:text-slate-900'}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên API <span className="text-red-500">*</span></label>
                    <input title="Nhập liệu" aria-label="Trường nhập liệu"
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Nhập tên API..."
                      defaultValue={apiData ? apiData.name : ''}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Endpoint (URL) <span className="text-red-500">*</span></label>
                    <input title="Nhập liệu" aria-label="Trường nhập liệu"
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                      placeholder="/api/v1/..."
                      defaultValue={apiData ? apiData.endpoint : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phương thức <span className="text-red-500">*</span></label>
                    <select title="Tùy chọn" aria-label="Tùy chọn" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                      defaultValue={apiData ? apiData.method : 'GET'}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phiên bản <span className="text-red-500">*</span></label>
                    <input title="Nhập liệu" aria-label="Trường nhập liệu"
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="v1.0"
                      defaultValue={apiData ? apiData.version : 'v1.0'}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                    <textarea
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      rows={3}
                      placeholder="Mô tả chức năng của API..."
                    ></textarea>
                  </div>

                  {/* NDXP Integration Section */}
                  <div className="md:col-span-2 pt-4 border-t border-slate-200 mt-2">
                    <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Tích hợp Nền tảng chia sẻ dữ liệu quốc gia (NDXP)</h3>
                        <p className="text-xs text-slate-500">Đăng ký API này lên hệ thống NDXP để chia sẻ dữ liệu với các bộ ngành khác.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isNdxpEnabled} onChange={(e) => setIsNdxpEnabled(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    {isNdxpEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-100 animate-in fade-in duration-300">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Mã dịch vụ NDXP <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20" placeholder="VD: BTP.01.01" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Giao thức kết nối</label>
                          <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                            <option>REST</option>
                            <option>SOAP</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Cơ quan chủ quản (Mã định danh)</label>
                          <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20" placeholder="VD: 000.00.00.H01 - Bộ Tư pháp" defaultValue="000.00.00.H01 - Bộ Tư pháp" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Thiết kế cấu trúc gói tin */}
            {activeTab === 'packet' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
 
                  {/* Live API Response Preview */}
                  <section className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group ring-1 ring-white/5">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12">
                       <Code className="w-24 h-24 text-white" />
                     </div>
                     
                     <div className="flex items-center justify-between mb-6">
                       <h4 className="font-bold text-slate-400 flex items-center text-[10px] uppercase tracking-[0.3em]">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                         Live API Response Preview
                       </h4>
                       <button
                         type="button"
                         onClick={() => {
                           navigator.clipboard.writeText(generateDynamicPreview());
                           alert('Đã sao chép phản hồi mẫu JSON!');
                         }}
                         title="Copy JSON"
                         className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                       >
                         <Copy className="w-4 h-4" />
                       </button>
                     </div>
                     
                     <div className="relative">
                       <pre className="font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar scrollbar-thin p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-300">
                         <code>{generateDynamicPreview()}</code>
                       </pre>
                     </div>
                  </section>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
          <button title="Hủy bỏ" aria-label="Hủy bỏ"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium cursor-pointer"
          >
            Hủy bỏ
          </button>
          {activeTab === 'general' ? (
            <button title="Tiếp tục" aria-label="Tiếp tục"
              onClick={() => setActiveTab('packet')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium cursor-pointer"
            >
              Tiếp tục
            </button>
          ) : (
            <button title="Lưu" aria-label="Lưu"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium cursor-pointer"
            >
              <Check className="w-5 h-5 mr-2" />
              {apiData ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
