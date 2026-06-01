import React, { useState } from 'react';
import { X, Check, FileText, Plug, LayoutTemplate, ShieldCheck, Plus, Trash2, Code, Key, Copy, Eye, EyeOff, Database, Send, Save, ArrowLeft, Pencil } from 'lucide-react';

interface ProvisionServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (isPublic: boolean) => void;
  onSaveDraft?: () => void;
  onSubmitApproval?: () => void;
  service?: any;
}

type TabType = 'general' | 'protocol' | 'access';

// Mock Database Schema for Civil Registry
const mockSchema: Record<string, string[]> = {
  'ho_tich_ca_nhan': ['id', 'ma_vinh_vien', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dinh_danh'],
  'giay_khai_sinh': ['id', 'so_giay_khai_sinh', 'ngay_dang_ky', 'noi_sinh', 'ho_ten_cha', 'ho_ten_me'],
  'dia_chi_thuong_tru': ['id', 'user_id', 'id_ho_tich', 'tinh_thanh', 'quan_huyen', 'phuong_xa', 'chi_tiet'],
  'thong_tin_cha_me': ['id', 'id_ho_tich', 'ho_ten_cha', 'cccd_cha', 'ho_ten_me', 'cccd_me']
};
const tableNames = Object.keys(mockSchema);

export function ProvisionServiceModal({ isOpen, onClose, onSave, onSaveDraft, onSubmitApproval, service }: ProvisionServiceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [accessScope, setAccessScope] = useState('all');
  
  // States for packet design (Tab 3)
  const [format, setFormat] = useState('json');
  const [fields, setFields] = useState<any[]>([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'id' },
    { id: 2, name: 'ho_ten', type: 'string', description: 'Họ và tên', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'ho_ten' },
    { id: 3, name: 'so_dinh_danh', type: 'string', description: 'Số định danh cá nhân', isMasked: true, maskRule: 'hide_middle_4', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'so_dinh_danh' }
  ]);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(true);
  const [rateLimitValue, setRateLimitValue] = useState(100);
  const [hasJoin, setHasJoin] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  // Dynamic table joins state
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

  if (!isOpen) return null;

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'protocol' as TabType, label: 'Cấu hình API & Giao thức', icon: <Plug className="w-4 h-4" /> },
    { id: 'access' as TabType, label: 'Phân quyền truy cập', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitApproval) {
      onSubmitApproval();
    } else {
      if (onSave) onSave(isPublic);
      alert(service ? 'Cập nhật dịch vụ thành công!' : 'Khởi tạo dịch vụ cung cấp thành công!');
    }
    onClose();
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) onSaveDraft();
    onClose();
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
        
        // Auto-populate when sourceColumn changes
        if (property === 'sourceColumn') {
          updated.name = value; // Default API field name is the column name
          
          // Deduce type and description automatically
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
    
    // Add fields dynamically based on state
    fields.forEach(f => {
      if (f.isCalculated) {
        if (f.type === 'number') {
          dataObj[f.name] = 42;
        } else if (f.type === 'boolean') {
          dataObj[f.name] = true;
        } else if (f.type === 'datetime') {
          dataObj[f.name] = "2026-05-28T13:45:00Z";
        } else {
          if (f.formula.includes('CONCAT')) {
            dataObj[f.name] = "Nguyễn Văn A - USR-99812";
          } else if (f.formula.includes('UPPER')) {
            dataObj[f.name] = "NGUYỄN VĂN A";
          } else {
            dataObj[f.name] = `Computed: ${f.formula.substring(0, 20)}`;
          }
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
        } else if (colName === 'so_dien_thoai') {
          dataObj[f.name || 'so_dien_thoai'] = f.isMasked ? "091••••285" : "0912345285";
        } else if (colName === 'tinh_thanh') {
          dataObj[f.name || 'tinh_thanh'] = "Thành phố Hà Nội";
        } else if (colName === 'quan_huyen') {
          dataObj[f.name || 'quan_huyen'] = "Quận Ba Đình";
        } else if (colName === 'phuong_xa') {
          dataObj[f.name || 'phuong_xa'] = "Phường Điện Biên";
        } else if (colName === 'chi_tiet') {
          dataObj[f.name || 'chi_tiet'] = "Số 10 Hùng Vương";
        } else if (colName === 'so_giay_khai_sinh') {
          dataObj[f.name || 'so_giay_khai_sinh'] = "KS-2026-9912";
        } else if (colName === 'ho_ten_cha') {
          dataObj[f.name || 'ho_ten_cha'] = "Nguyễn Văn B";
        } else if (colName === 'ho_ten_me') {
          dataObj[f.name || 'ho_ten_me'] = "Trần Thị C";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/50 backdrop-blur-sm transition-all duration-300 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex flex-1 overflow-hidden relative">
          {/* Close button */}
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Sidebar Navigation - Refined Spacing */}
          <div className="w-72 border-r border-slate-200 bg-slate-50/50 p-6 flex flex-col gap-4 shrink-0">
            <div className="mb-6 px-4">
               <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-600 w-fit mb-3">
                  <Plug className="w-6 h-6" />
               </div>
               <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">
                  {service ? 'Cấu hình Dịch vụ' : 'Dịch vụ Mới'}
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
            {/* TAB 1: Thông tin chung */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    Thông tin định danh dịch vụ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tên dịch vụ chia sẻ <span className="text-red-500">*</span></label>
                      <input aria-label="Tên dịch vụ" title="Tên dịch vụ"
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 transition-all duration-300"
                        placeholder="Nhập tên dịch vụ..."
                        defaultValue={service ? service.name : ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mã định danh API <span className="text-red-500">*</span></label>
                      <input aria-label="Mã dịch vụ" title="Mã dịch vụ"
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-blue-600 font-mono text-sm placeholder:text-slate-400 transition-all duration-300 font-semibold"
                        placeholder="VD: api_v1_hotich"
                        defaultValue={service ? service.code : ''}
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center w-full">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phân loại dữ liệu <span className="text-red-500">*</span></label>
                        <select aria-label="Loại dữ liệu" title="Loại dữ liệu" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                        >
                          <option value="" className="text-slate-400">-- Chọn phân loại --</option>
                          <option value="ho_tich" className="text-slate-800">Dữ liệu Hộ tịch điện tử</option>
                          <option value="quoc_tich" className="text-slate-800">Dữ liệu Hồ sơ quốc tịch</option>
                          <option value="thi_hanh_an" className="text-slate-800">Dữ liệu Thi hành án dân sự</option>
                          <option value="ly_lich" className="text-slate-800">Dữ liệu Lý lịch tư pháp</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-6 ml-8 shrink-0">
                        <input 
                          id="is-public-checkbox"
                          type="checkbox" 
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer transition-all"
                        />
                        <label htmlFor="is-public-checkbox" className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-all duration-300">
                          API Công khai
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả nghiệp vụ</label>
                      <textarea title="Mô tả" aria-label="Mô tả"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 transition-all duration-300"
                        rows={4}
                        placeholder="Mô tả chi tiết mục đích API..."
                      ></textarea>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 2: Cấu hình API & Giao thức */}
            {activeTab === 'protocol' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    Thiết lập kết nối & Bảo mật
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Giao thức <span className="text-red-500">*</span></label>
                      <select aria-label="Giao thức" title="Giao thức" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                      >
                        <option value="rest" className="text-slate-850">REST API (Standard JSON)</option>
                        <option value="soap" className="text-slate-850">SOAP API (Enterprise XML)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đồng bộ</label>
                      <select aria-label="Tần suất" title="Tần suất" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                      >
                        <option value="realtime" className="text-slate-850">Truy vấn Real-time</option>
                        <option value="daily" className="text-slate-850">Định kỳ (Batch)</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isRateLimited ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-[0_0_10px_rgba(37,99,235,0.05)]' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                            <Plug className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-850">Giới hạn lưu lượng (Rate Limit)</div>
                            <div className="text-xs text-slate-500">Giới hạn số lượng request API mỗi phút</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isRateLimited && (
                            <input 
                              type="number" 
                              title="Giá trị giới hạn"
                              aria-label="Giá trị giới hạn lưu lượng"
                              className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-center text-blue-600 font-bold focus:outline-none focus:border-blue-500 transition-all" 
                              value={rateLimitValue} 
                              onChange={(e) => setRateLimitValue(Number(e.target.value))} 
                            />
                          )}
                          <div 
                            onClick={() => setIsRateLimited(!isRateLimited)}
                            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${isRateLimited ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${isRateLimited ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: Phân quyền truy cập */}
            {activeTab === 'access' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    Kiểm soát quyền hạn & Cấp phát Key
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chính sách</label>
                        <select aria-label="Chính sách" title="Chính sách" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                        >
                          <option value="restricted" className="text-slate-800">Hạn chế (Restricted Gov Access)</option>
                          <option value="public" className="text-slate-800">Công khai (Public Open Data)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đối tượng</label>
                        <select aria-label="Phạm vi" title="Phạm vi" 
                          value={accessScope} 
                          onChange={(e) => setAccessScope(e.target.value)} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                        >
                          <option value="gov" className="text-slate-800">Khối bộ ngành chuyên trách</option>
                          <option value="all" className="text-slate-800">Tất cả đối tác</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Master API Access Token</div>
                        <button type="button" onClick={() => setApiKey('dldc_live_9f8e7d6c5b4a3f2e1d0c')} className="text-[10px] font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center shadow-sm cursor-pointer">
                          RE-GENERATE
                        </button>
                      </div>
                      
                      <div className="relative mb-4">
                        <input aria-label="API Key" title="API Key"
                          type={showKey ? "text" : "password"}
                          readOnly
                          value={apiKey || '••••••••••••••••••••••••••••••••'}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-mono text-sm text-slate-800 pr-12 focus:outline-none focus:border-blue-500/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                          {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                           <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Expiration</div>
                           <div className="text-xs text-slate-800 font-bold">2026-12-31</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Security</div>
                           <div className="text-xs text-emerald-600 font-bold uppercase">Enterprise</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-200 bg-slate-50/80 backdrop-blur-lg">
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1,2,3].map(step => (
                  <div key={step} className={`h-1 rounded-full transition-all duration-300 ${
                    (activeTab === 'general' && step === 1) || 
                    (activeTab === 'protocol' && step === 2) || 
                    (activeTab === 'access' && step === 3) 
                      ? 'w-6 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'w-2 bg-slate-200'
                  }`}></div>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {activeTab === 'general' ? 'Step 1 of 3' : activeTab === 'protocol' ? 'Step 2 of 3' : 'Step 3 of 3'}
              </div>
           </div>
           
           <div className="flex items-center gap-3">
             <button title="Lưu tạm" aria-label="Lưu tạm"
              onClick={handleSaveDraft}
              className="px-6 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer border border-slate-250 bg-white"
            >
              <Save className="w-4 h-4" />
              Lưu tạm
            </button>
            <button title="Hủy bỏ" aria-label="Hủy bỏ"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-250 bg-white transition-all duration-300 font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              Hủy bỏ
            </button>
            {activeTab !== 'general' && (
              <button 
                title="Quay lại" aria-label="Quay lại"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                }} 
                className="px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-250 bg-white transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
            )}
            {activeTab !== 'access' ? (
              <button 
                title="Tiếp tục" aria-label="Tiếp tục"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                }} 
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Tiếp tục
              </button>
            ) : (
              <button title="Trình duyệt" aria-label="Trình duyệt & Gửi phê duyệt"
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                <Send className="w-5 h-5 mr-2" />
                Trình duyệt
              </button>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}