import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeftRight, Database, Search, TableProperties, Key } from 'lucide-react';
import { TargetDatabase } from './mockTargetDatabases';

interface DataMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: TargetDatabase | null; 
  targetDatabase?: TargetDatabase | null; 
  sourceDatasetName?: string;
}

export function DataMappingModal({ isOpen, onClose, data, targetDatabase, sourceDatasetName }: DataMappingModalProps) {
  const [selectedSourceTable, setSelectedSourceTable] = useState('table1');
  const [selectedTargetTable, setSelectedTargetTable] = useState('table1');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex py-10 px-4 items-start justify-center font-sans"
      style={{ zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white w-full max-w-[900px] h-[calc(100vh-80px)] flex flex-col rounded-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">

        
        {/* Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
              <ArrowLeftRight className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">Ánh xạ dữ liệu</h2>
              <p className="text-[12px] text-slate-500 mt-0.5">Liên kết bảng nguồn với CSDL Kho dữ liệu dùng chung</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-0 bg-white">
          {/* LEFT SIDE - SOURCE */}
          <div className="flex-1 flex flex-col p-5 border-r border-slate-100 min-w-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Database className="w-4.5 h-4.5 text-blue-600" />
              <div>
                <h3 className="font-bold text-[14px] text-slate-800">Cơ sở dữ liệu thu thập</h3>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">Bảng chính & các trường</p>
              </div>
            </div>

            {/* Search bars */}
            <div className="flex items-center gap-4 mb-4 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Lọc cột..." className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            {/* Lists */}
            <div className="flex-1 flex gap-4 min-h-0">
              {/* Fields */}
              <div className="w-full overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                
                <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-1.5">DIP_RefId</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">VARCHAR</span></div>
                        <div><span className="text-slate-400">Length:</span> <span className="font-medium text-slate-700 ml-1">4000</span></div>
                        <div><span className="text-slate-400">Nullable:</span> <span className="font-medium text-slate-700 ml-1">true</span></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-all group shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-blue-600 flex items-center justify-center border border-blue-600">
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-[13px] text-slate-800">ID</span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 text-[10px] font-bold">
                          <Key className="w-2.5 h-2.5" /> PK
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">INT</span></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-1.5">HOTEN</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">NVARCHAR</span></div>
                        <div><span className="text-slate-400">Length:</span> <span className="font-medium text-slate-700 ml-1">255</span></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-1.5">NGAYSINH</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">DATE</span></div>
                      </div>
                    </div>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TARGET */}
          <div className="flex-[1.2] flex flex-col p-5 border-l border-slate-100 min-w-0 bg-slate-50/30">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Database className="w-4.5 h-4.5 text-blue-600" />
              <div>
                <h3 className="font-bold text-[14px] text-slate-800">Cơ sở dữ liệu xử lý</h3>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">Bảng đích & các trường</p>
              </div>
            </div>

            {/* Search bars */}
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Lọc bảng..." className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400" />
              </div>
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Lọc cột..." className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            {/* Lists */}
            <div className="flex-1 flex gap-4 min-h-0">
              {/* Tables */}
              <div className="w-[42%] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                
                <div onClick={() => setSelectedTargetTable('table1')} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTargetTable === 'table1' ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-800'}`}>
                  <div className="flex items-start gap-2.5">
                    <TableProperties className={`w-4 h-4 mt-0.5 shrink-0 ${selectedTargetTable === 'table1' ? 'text-blue-200' : 'text-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-bold text-[13px] leading-snug truncate">CongDan</div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${selectedTargetTable === 'table1' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>1</div>
                      </div>
                      <div className={`text-[11px] font-medium truncate ${selectedTargetTable === 'table1' ? 'text-blue-100' : 'text-slate-500'}`}>CongDan · 4 trường</div>
                    </div>
                  </div>
                </div>

                <div onClick={() => setSelectedTargetTable('table2')} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTargetTable === 'table2' ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-800'}`}>
                  <div className="flex items-start gap-2.5">
                    <TableProperties className={`w-4 h-4 mt-0.5 shrink-0 ${selectedTargetTable === 'table2' ? 'text-blue-200' : 'text-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px] mb-1.5 leading-snug truncate">CongDanGoc</div>
                      <div className={`text-[11px] font-medium truncate ${selectedTargetTable === 'table2' ? 'text-blue-100' : 'text-slate-500'}`}>CongDanGoc · 1 trường</div>
                    </div>
                  </div>
                </div>

                <div onClick={() => setSelectedTargetTable('table3')} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTargetTable === 'table3' ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-800'}`}>
                  <div className="flex items-start gap-2.5">
                    <TableProperties className={`w-4 h-4 mt-0.5 shrink-0 ${selectedTargetTable === 'table3' ? 'text-blue-200' : 'text-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px] mb-1.5 leading-snug truncate">DangKyXe</div>
                      <div className={`text-[11px] font-medium truncate ${selectedTargetTable === 'table3' ? 'text-blue-100' : 'text-slate-500'}`}>DangKyXe · 1 trường</div>
                    </div>
                  </div>
                </div>

                <div onClick={() => setSelectedTargetTable('table4')} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTargetTable === 'table4' ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-800'}`}>
                  <div className="flex items-start gap-2.5">
                    <TableProperties className={`w-4 h-4 mt-0.5 shrink-0 ${selectedTargetTable === 'table4' ? 'text-blue-200' : 'text-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-bold text-[13px] leading-snug truncate">GiayPhepLaiXe</div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${selectedTargetTable === 'table4' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>1</div>
                      </div>
                      <div className={`text-[11px] font-medium truncate ${selectedTargetTable === 'table4' ? 'text-blue-100' : 'text-slate-500'}`}>GiayPhepLaiXe · 3 trường</div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Fields */}
              <div className="w-[58%] overflow-y-auto pl-1 space-y-2.5 custom-scrollbar">
                
                <label className="block p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-all group shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-blue-600 flex items-center justify-center border border-blue-600">
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-1.5">DIP_RefId</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">VARCHAR</span></div>
                        <div><span className="text-slate-400">Length:</span> <span className="font-medium text-slate-700 ml-1">4000</span></div>
                        <div><span className="text-slate-400">Nullable:</span> <span className="font-medium text-slate-700 ml-1">true</span></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-[13px] text-slate-800">ID</span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 text-[10px] font-bold">
                          <Key className="w-2.5 h-2.5" /> PK
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">INT</span></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-1.5">HoTen</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">NVARCHAR</span></div>
                        <div><span className="text-slate-400">Length:</span> <span className="font-medium text-slate-700 ml-1">255</span></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-1.5">CongDanID</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                        <div><span className="text-slate-400">Type:</span> <span className="font-medium text-slate-700 ml-1">INT</span></div>
                      </div>
                    </div>
                  </div>
                </label>

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              alert('Đã lưu cấu hình ánh xạ!');
              onClose();
            }}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Lưu cấu hình
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
