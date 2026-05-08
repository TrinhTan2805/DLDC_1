import React from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Trash2, Check, ExternalLink } from 'lucide-react';
import { TargetDatabase } from './mockTargetDatabases';

interface DataMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: TargetDatabase | null; 
  targetDatabase?: TargetDatabase | null; 
  sourceDatasetName?: string;
}

export function DataMappingModal({ isOpen, onClose, data, targetDatabase, sourceDatasetName }: DataMappingModalProps) {
  if (!isOpen) return null;

  const db = targetDatabase || data;
  const dbName = db?.name || 'aaaaa';
  const sourceName = sourceDatasetName || 'SQL Server 2012';

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans p-4">
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        onClick={onClose}
      ></div>

      {/* Modal Window - Adjusted to be smaller */}
      <div 
        className="relative bg-white flex flex-col shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ width: '1150px', maxWidth: '95vw', height: '80vh', maxHeight: '750px' }}
      >
        
        {/* Dark Header */}
        <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <h2 className="text-white font-medium text-[14px]">Ánh xạ dữ liệu</h2>
          <div className="flex items-center gap-3 text-slate-300">
            <button className="hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-5 overflow-hidden bg-white">
          
          {/* Top action */}
          <div className="mb-5">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white font-medium text-[13px] rounded hover:bg-blue-700 transition-colors shadow-sm">
              Danh sách CSDL kết nối
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Bordered Container for Content & Footer */}
          <div className="flex-1 border border-slate-200 flex flex-col overflow-hidden min-h-0 shadow-sm rounded-sm">
            
            {/* Split Content */}
            <div className="flex flex-1 min-h-0 divide-x divide-slate-200">
              
              {/* Left Half - Source */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="px-6 py-4 shrink-0 border-b border-slate-200">
                  <h3 className="text-[16px] font-semibold text-slate-800">Cơ sở dữ liệu kết nối</h3>
                </div>
                <div className="flex-1 flex min-h-0 p-5 gap-5">
                  
                  {/* Source Tables */}
                  <div className="w-[35%] flex flex-col gap-3 min-h-0 shrink-0">
                    <input 
                      type="text" 
                      placeholder="Lọc bảng" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-blue-500" 
                    />
                    <div className="flex-1 border border-slate-200 flex flex-col min-h-0 overflow-hidden">
                      <div className="bg-blue-600 text-white px-4 py-2.5 text-[13px] font-bold shrink-0">
                        {sourceName}
                      </div>
                      <div className="flex-1 overflow-y-auto bg-white">
                        <label className="flex items-start gap-2.5 p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" defaultChecked className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800">HOCSINH</div>
                            <div className="text-[12px] text-slate-500 italic mt-0.5">(Ref: GiayPhepLaiXe)</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Source Columns */}
                  <div className="w-[65%] flex flex-col gap-3 min-h-0">
                    <input 
                      type="text" 
                      placeholder="Lọc cột" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-blue-500" 
                    />
                    <div className="flex-1 border border-slate-200 flex flex-col min-h-0 overflow-hidden">
                      <div className="flex-1 overflow-y-auto bg-white">
                        <label className="flex items-start gap-2.5 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-3">DIP_RefId</div>
                            <div className="text-[12px] text-slate-700 space-y-1.5 italic mb-3">
                              <div>Type: VARCHAR</div>
                              <div>Length: 4000</div>
                              <div>Nullable: true</div>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-start gap-2.5 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" defaultChecked className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-3">ID (PK)</div>
                            <div className="text-[12px] text-slate-700 space-y-1.5 italic mb-3">
                              <div>Type: INT</div>
                              <div>Length: 0</div>
                              <div>Nullable: false</div>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-start gap-2.5 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-3">HOTEN</div>
                            <div className="text-[12px] text-slate-700 space-y-1.5 italic mb-3">
                              <div>Type: NVARCHAR</div>
                              <div>Length: 2147483647</div>
                              <div>Nullable: true</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Half - Target */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-200">
                  <h3 className="text-[16px] font-semibold text-slate-800">{dbName}</h3>
                  <button className="p-1.5 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 flex min-h-0 p-5 gap-5">
                  
                  {/* Target Tables */}
                  <div className="w-[35%] flex flex-col gap-3 min-h-0 shrink-0">
                    <input 
                      type="text" 
                      placeholder="Lọc bảng" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-blue-500" 
                    />
                    <div className="flex-1 border border-slate-200 flex flex-col min-h-0 overflow-hidden">
                      <div className="flex-1 overflow-y-auto bg-white">
                        <label className="flex items-start gap-2.5 p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" defaultChecked className="mt-1" />
                          <span className="text-[13px] font-bold text-slate-800">CongDan</span>
                        </label>
                        <label className="flex items-start gap-2.5 p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-[13px] font-bold text-slate-800">CongDanGoc</span>
                        </label>
                        <label className="flex items-start gap-2.5 p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-[13px] font-bold text-slate-800">DangKyXe</span>
                        </label>
                        <label className="flex items-start gap-2.5 p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" defaultChecked className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800">GiayPhepLaiXe</div>
                            <div className="text-[12px] text-slate-500 italic mt-0.5">(Ref: HOCSINH!)</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Target Columns */}
                  <div className="w-[65%] flex flex-col gap-3 min-h-0">
                    <input 
                      type="text" 
                      placeholder="Lọc cột" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-blue-500" 
                    />
                    <div className="flex-1 border border-slate-200 flex flex-col min-h-0 overflow-hidden">
                      <div className="flex-1 overflow-y-auto bg-white">
                        <label className="flex items-start gap-2.5 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" defaultChecked className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-3">DIP_RefId</div>
                            <div className="text-[12px] text-slate-700 space-y-1.5 italic mb-3">
                              <div>Type: VARCHAR</div>
                              <div>Length: 4000</div>
                              <div>Nullable: true</div>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-start gap-2.5 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-3">ID (PK)</div>
                            <div className="text-[12px] text-slate-700 space-y-1.5 italic mb-3">
                              <div>Type: INT</div>
                              <div>Length: 0</div>
                              <div>Nullable: false</div>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-start gap-2.5 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-3">CongDanID</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Footer inside the bordered container */}
            <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-[13px] font-medium text-white bg-slate-500 hover:bg-slate-600 rounded transition-colors flex items-center gap-1.5"
              >
                Trở về <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  alert('Đã tiếp tục cấu hình ánh xạ!');
                  onClose();
                }}
                className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#00bcd4] hover:bg-[#00acc1] rounded transition-colors flex items-center gap-1.5"
              >
                Tiếp theo <Check className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );

  // Use React Portal to render the modal directly to document.body
  // This guarantees it will always float above sidebars and other overlapping elements
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return modalContent;
}
