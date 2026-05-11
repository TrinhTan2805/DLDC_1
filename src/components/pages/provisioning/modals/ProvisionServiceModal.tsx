import React, { useState } from 'react';
import { X, Check, FileText, Plug, LayoutTemplate, ShieldCheck, Plus, Trash2, Code, Key, Copy, Eye, EyeOff, Database } from 'lucide-react';

interface ProvisionServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (isPublic: boolean) => void;
  service?: any;
}

type TabType = 'general' | 'protocol' | 'packet' | 'access';

export function ProvisionServiceModal({ isOpen, onClose, onSave, service }: ProvisionServiceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [accessScope, setAccessScope] = useState('all');
  
  // States for packet design (Tab 3)
  const [format, setFormat] = useState('json');
  const [fields, setFields] = useState([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '' },
    { id: 2, name: 'thoi_gian', type: 'datetime', description: 'Thời gian cập nhật', isMasked: false, maskRule: '' },
    { id: 3, name: 'so_dien_thoai', type: 'string', description: 'Số điện thoại', isMasked: true, maskRule: 'hide_middle_4' }
  ]);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(true);
  const [rateLimitValue, setRateLimitValue] = useState(100);
  const [hasJoin, setHasJoin] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'protocol' as TabType, label: 'Cấu hình API & Giao thức', icon: <Plug className="w-4 h-4" /> },
    { id: 'packet' as TabType, label: 'Thiết kế cấu trúc gói tin', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'access' as TabType, label: 'Phân quyền truy cập', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(isPublic);
    alert(service ? 'Cập nhật dịch vụ thành công!' : 'Khởi tạo dịch vụ cung cấp thành công!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex flex-1 overflow-hidden relative">
          {/* Close button moved from header to a floating position */}
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Sidebar Navigation - Refined Spacing */}
          <div className="w-72 border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col gap-4 shrink-0">
            <div className="mb-6 px-4">
               <div className="p-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-600 w-fit mb-3">
                  <Plug className="w-6 h-6" />
               </div>
               <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">
                  {service ? 'Cấu hình Dịch vụ' : 'Dịch vụ Mới'}
               </h2>
               <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">API Provisioning Engine</p>
            </div>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-xs font-bold rounded-2xl transition-all flex items-center gap-4 group uppercase tracking-widest ${
                  activeTab === tab.id 
                    ? 'bg-white text-amber-600 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200' 
                    : 'text-slate-400 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <span className={`${activeTab === tab.id ? 'text-amber-600' : 'text-slate-300 group-hover:text-amber-500'} transition-colors`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area - Light */}
          <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar">
            {/* TAB 1: Thông tin chung */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                    Thông tin định danh dịch vụ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tên dịch vụ chia sẻ <span className="text-red-500">*</span></label>
                      <input aria-label="Tên dịch vụ" title="Tên dịch vụ"
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                        placeholder="Nhập tên dịch vụ..."
                        defaultValue={service ? service.name : ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mã định danh API <span className="text-red-500">*</span></label>
                      <input aria-label="Mã dịch vụ" title="Mã dịch vụ"
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-amber-700 font-mono text-sm"
                        placeholder="VD: api_v1_hotich"
                        defaultValue={service ? service.code : ''}
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-12">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phân loại dữ liệu <span className="text-red-500">*</span></label>
                        <select aria-label="Loại dữ liệu" title="Loại dữ liệu" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900">
                          <option value="">-- Chọn phân loại --</option>
                          <option value="ho_tich">Dữ liệu Hộ tịch điện tử</option>
                          <option value="quoc_tich">Dữ liệu Hồ sơ quốc tịch</option>
                          <option value="thi_hanh_an">Dữ liệu Thi hành án dân sự</option>
                          <option value="ly_lich">Dữ liệu Lý lịch tư pháp</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-6 min-w-fit">
                        <input 
                          id="is-public-checkbox"
                          type="checkbox" 
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="w-6 h-6 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer transition-all"
                        />
                        <label htmlFor="is-public-checkbox" className="text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">
                          API Công khai
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả nghiệp vụ</label>
                      <textarea title="Mô tả" aria-label="Mô tả"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
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
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                    Thiết lập kết nối & Bảo mật
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Giao thức <span className="text-red-500">*</span></label>
                      <select aria-label="Giao thức" title="Giao thức" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                        <option value="rest">REST API (Standard JSON)</option>
                        <option value="soap">SOAP API (Enterprise XML)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đồng bộ</label>
                      <select aria-label="Tần suất" title="Tần suất" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                        <option value="realtime">Truy vấn Real-time</option>
                        <option value="daily">Định kỳ (Batch)</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isRateLimited ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400 border border-slate-100'}`}>
                            <Plug className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">Giới hạn lưu lượng (Rate Limit)</div>
                            <div className="text-xs text-slate-500">Giới hạn số lượng request API mỗi phút</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isRateLimited && (
                            <input 
                              type="number" 
                              title="Giá trị giới hạn"
                              aria-label="Giá trị giới hạn lưu lượng"
                              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-sm text-center" 
                              value={rateLimitValue} 
                              onChange={(e) => setRateLimitValue(Number(e.target.value))} 
                            />
                          )}
                          <div 
                            onClick={() => setIsRateLimited(!isRateLimited)}
                            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-all ${isRateLimited ? 'bg-amber-500' : 'bg-slate-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-all ${isRateLimited ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: Thiết kế cấu trúc gói tin */}
            {activeTab === 'packet' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {/* Data Source Configuration - Flexible & Compact */}
                 <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-5">
                     <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600">
                          <Database className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Cấu hình Nguồn dữ liệu</h4>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Sử dụng liên kết bảng (Join)</span>
                        <div 
                          onClick={() => setHasJoin(!hasJoin)}
                          className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-all ${hasJoin ? 'bg-amber-500' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${hasJoin ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                     {/* Primary Table */}
                     <div className={`transition-all duration-300 ${hasJoin ? 'md:col-span-1' : 'md:col-span-2'}`}>
                        <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-500/50 transition-all group/table">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">
                             <span>Bảng dữ liệu chính</span>
                             <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded italic">Primary Table</span>
                          </label>
                          <select title="Chọn bảng chính" className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-800 outline-none cursor-pointer">
                             <option value="ho_tich_ca_nhan">ho_tich_ca_nhan (Hộ tịch cá nhân)</option>
                             <option value="giay_khai_sinh">giay_khai_sinh (Giấy khai sinh)</option>
                          </select>
                        </div>
                     </div>

                     {/* Join Table (Conditional) */}
                     {hasJoin && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                          <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-500/50 transition-all group/table relative">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white z-10 shadow-md">
                               +
                            </div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">
                               <span>Bảng liên kết bổ sung</span>
                               <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded italic">Joined Table</span>
                            </label>
                            <select title="Chọn bảng phụ" className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-800 outline-none cursor-pointer">
                               <option value="dia_chi_thuong_tru">dia_chi_thuong_tru (Địa chỉ thường trú)</option>
                               <option value="thong_tin_cha_me">thong_tin_cha_me (Thông tin cha mẹ)</option>
                            </select>
                          </div>
                        </div>
                     )}
                   </div>

                   {/* Join Condition - Compact Flowchart Style */}
                   {hasJoin && (
                     <div className="mt-4 p-4 bg-amber-50/40 rounded-xl border border-amber-100 border-dashed animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                           <div className="flex-1 w-full">
                              <select title="Trường PK" className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600 outline-none focus:border-amber-500">
                                 <option>ho_tich_ca_nhan.id</option>
                                 <option>ho_tich_ca_nhan.ma_vinh_vien</option>
                              </select>
                           </div>
                           <div className="text-amber-500 font-black text-xs px-2 py-1 bg-white rounded border border-amber-100 shadow-sm">=</div>
                           <div className="flex-1 w-full">
                              <select title="Trường FK" className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600 outline-none focus:border-amber-500">
                                 <option>dia_chi_thuong_tru.user_id</option>
                                 <option>dia_chi_thuong_tru.id_ho_tich</option>
                              </select>
                           </div>
                        </div>
                     </div>
                   )}
                 </section>

                 {/* Field Definition Table */}
                 <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/30">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <LayoutTemplate className="w-5 h-5 text-amber-600" />
                      Chọn trường dữ liệu chia sẻ (Field Selection)
                    </h4>
                    <button title="Thêm trường" aria-label="Thêm trường" className="text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all shadow-md">
                      <Plus className="w-4 h-4 mr-2" /> Thêm trường tính toán
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                          <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-12">Chia sẻ</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-12">PK</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px]">Tên trường (API Field)</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px]">Nguồn dữ liệu (Table)</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px]">Kiểu dữ liệu</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] text-center">Che dấu</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {fields.map(field => (
                          <tr key={field.id} className="hover:bg-slate-50/50 group transition-colors">
                            <td className="px-4 py-3 text-center">
                              <input type="checkbox" title="Chọn trường" className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer" defaultChecked />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Key className={`w-4 h-4 mx-auto ${field.id === 1 ? 'text-amber-500' : 'text-slate-200 hover:text-slate-300 cursor-pointer'}`} />
                            </td>
                            <td className="px-4 py-3">
                              <input title="Tên trường" aria-label="Tên trường" type="text" className="w-full bg-white border border-slate-100 px-2 py-1 rounded focus:border-amber-500 outline-none text-slate-800 font-medium" defaultValue={field.name} />
                            </td>
                            <td className="px-4 py-3">
                              <select title="Nguồn" className="text-[10px] px-1 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-500 font-mono outline-none">
                                <option>ho_tich_ca_nhan</option>
                                <option>dia_chi_thuong_tru</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <select title="Kiểu" className="text-[10px] font-bold text-slate-500 bg-transparent border-none outline-none uppercase">
                                <option>string</option>
                                <option>number</option>
                                <option>datetime</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input type="checkbox" title="Masking" className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer" defaultChecked={field.isMasked} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button title="Xóa" aria-label="Xóa" className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                 </section>

                 {/* ONLY THIS SECTION REMAINS DARK/PRO */}
                 <section className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group ring-1 ring-white/5">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12">
                      <Code className="w-24 h-24 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-slate-400 flex items-center text-[10px] uppercase tracking-[0.3em]">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                        Live API Response Preview
                      </h4>
                      <button title="Copy JSON" className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 backdrop-blur-md transition-all">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="relative">
                      <pre className="font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar scrollbar-thin p-4 bg-slate-900/50 rounded-xl border border-white/5">
                        <code className="text-slate-300">
{`{
  "`}<span className="text-amber-400">status</span>{`": "`} <span className="text-emerald-400">success</span> {`",
  "`}<span className="text-amber-400">data</span>{`": {
    "`}<span className="text-amber-400">id</span>{`": "`} <span className="text-emerald-400">USR-99812</span> {`",
    "`}<span className="text-amber-400">ho_tich_ca_nhan</span>{`": {
       "`}<span className="text-amber-400">ho_ten</span>{`": "`} <span className="text-emerald-400">Nguyễn Văn A</span> {`",
       "`}<span className="text-amber-400">ngay_sinh</span>{`": "`} <span className="text-emerald-400">1990-01-01</span> {`"
    },
    "`}<span className="text-amber-400">dia_chi_thuong_tru</span>{`": {
       "`}<span className="text-amber-400">tinh_thanh</span>{`": "`} <span className="text-emerald-400">Hà Nội</span> {`",
       "`}<span className="text-amber-400">quan_huyen</span>{`": "`} <span className="text-emerald-400">Cầu Giấy</span> {`"
    },
    "`}<span className="text-amber-400">metadata</span>{`": {
       "`}<span className="text-amber-400">source</span>{`": "`} <span className="text-emerald-400">BTP_DLDC_CORE</span> {`",
       "`}<span className="text-amber-400">timestamp</span>{`": "`} <span className="text-emerald-400">2026-05-11T08:50:00Z</span> {`"
    }
  }
}`}
                        </code>
                      </pre>
                    </div>
                 </section>
               </div>
            )}

            {/* TAB 4: Phân quyền truy cập */}
            {activeTab === 'access' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                    Kiểm soát quyền hạn & Cấp phát Key
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chính sách</label>
                        <select aria-label="Chính sách" title="Chính sách" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                          <option value="restricted">Hạn chế (Restricted Gov Access)</option>
                          <option value="public">Công khai (Public Open Data)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đối tượng</label>
                        <select aria-label="Phạm vi" title="Phạm vi" value={accessScope} onChange={(e) => setAccessScope(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                          <option value="gov">Khối bộ ngành chuyên trách</option>
                          <option value="all">Tất cả đối tác</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Master API Access Token</div>
                        <button type="button" onClick={() => setApiKey('dldc_live_9f8e7d6c5b4a3f2e1d0c')} className="text-[10px] font-bold text-white bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-900 transition-all flex items-center">
                          RE-GENERATE
                        </button>
                      </div>
                      
                      <div className="relative mb-4">
                        <input aria-label="API Key" title="API Key"
                          type={showKey ? "text" : "password"}
                          readOnly
                          value={apiKey || '••••••••••••••••••••••••••••••••'}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-mono text-sm text-slate-700 pr-12"
                        />
                        <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
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

        {/* Footer - Light */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/50 backdrop-blur-lg">
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1,2,3,4].map(step => (
                  <div key={step} className={`h-1 rounded-full transition-all duration-300 ${
                    (activeTab === 'general' && step === 1) || 
                    (activeTab === 'protocol' && step === 2) || 
                    (activeTab === 'packet' && step === 3) || 
                    (activeTab === 'access' && step === 4) 
                      ? 'w-6 bg-amber-500' : 'w-2 bg-slate-200'
                  }`}></div>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {activeTab === 'general' ? 'Step 1 of 4' : activeTab === 'protocol' ? 'Step 2 of 4' : activeTab === 'packet' ? 'Step 3 of 4' : 'Step 4 of 4'}
              </div>
           </div>
           
           <div className="flex items-center gap-3">
            <button title="Hủy bỏ" aria-label="Hủy bỏ"
              onClick={onClose}
              className="px-6 py-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest"
            >
              Hủy bỏ
            </button>
            {activeTab !== 'access' ? (
              <button 
                title="Tiếp tục" aria-label="Tiếp tục"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                }} 
                className="px-8 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-950 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200"
              >
                Tiếp tục
              </button>
            ) : (
              <button title="Xác nhận" aria-label="Lưu & Gửi phê duyệt"
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-200"
              >
                <Check className="w-5 h-5 mr-2 stroke-[3px]" />
                Deploy API
              </button>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}
