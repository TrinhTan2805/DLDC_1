import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, Database, Search, TableProperties, Key, Save } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';
import { TargetDatabase, mockTables, mockColumns } from './mockTargetDatabases';

interface DataMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDatabase?: TargetDatabase | null;
  sourceDatasetName?: string;
}

export function DataMappingModal({ isOpen, onClose, targetDatabase, sourceDatasetName }: DataMappingModalProps) {
  const [selectedTargetTable, setSelectedTargetTable] = useState('HS_KHAI_SINH');
  const [sourceSearch, setSourceSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');

  // Source fields mock
  const sourceFields = [
    { name: 'DIP_RefId', type: 'VARCHAR', length: '4000', nullable: true },
    { name: 'ID', type: 'INT', isPk: true },
    { name: 'HOTEN', type: 'NVARCHAR', length: '255' },
    { name: 'NGAYSINH', type: 'DATE' },
    { name: 'GIOITINH', type: 'VARCHAR', length: '10' },
  ];

  const targetFields = mockColumns[selectedTargetTable] || [];

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-[13px] flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Hủy bỏ
      </button>
      <button
        type="button"
        onClick={() => {
          alert('Đã lưu cấu hình ánh xạ!');
          onClose();
        }}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-[13px] flex items-center gap-2 shadow-md"
      >
        <Save className="w-4 h-4" />
        Lưu cấu hình
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ánh xạ dữ liệu"
      subtitle="Liên kết bảng nguồn với CSDL Kho dữ liệu dùng chung"
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <div className="flex gap-4 h-[460px] min-h-0">

        {/* CỘT 1 - Dữ liệu thu thập */}
        <div className="w-[230px] shrink-0 flex flex-col p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-[11px] text-slate-800 uppercase tracking-tight">Dữ liệu thu thập</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase truncate w-[160px]">Dang ky khai sinh</p>
            </div>
          </div>

          <div className="relative mb-3 shrink-0">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm trường"
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {sourceFields.map((field, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg border transition-all cursor-pointer group ${field.name === 'ID' ? 'border-blue-400 bg-blue-50/50' : 'border-slate-100 hover:border-blue-300 bg-white shadow-sm'}`}>
                <div className="flex items-start gap-2.5">
                  <div className="pt-0.5">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${field.name === 'ID' ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-500'}`}>
                      {field.name === 'ID' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="font-bold text-[11px] text-slate-800 truncate">{field.name}</span>
                      {field.isPk && (
                        <span className="inline-flex items-center px-1 bg-slate-100 text-slate-600 rounded text-[7px] font-bold border border-slate-200 uppercase">PK</span>
                      )}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium">
                      Type: <span className="text-slate-700">{field.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PHẦN BÊN PHẢI - Dữ liệu xử lý */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-100/50 flex items-center justify-center text-indigo-600">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-[11px] text-slate-800 uppercase tracking-tight">Cơ sở dữ liệu xử lý</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase">Bảng & trường đích</p>
            </div>
          </div>

          <div className="flex-1 flex gap-3 min-h-0">
            {/* CỘT GIỮA - Danh sách Bảng */}
            <div className="w-[230px] shrink-0 flex flex-col min-h-0 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div className="relative mb-3 shrink-0">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm bảng..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                {mockTables.map((table, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTargetTable(table.name)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${selectedTargetTable === table.name ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-800'}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <TableProperties className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${selectedTargetTable === table.name ? 'text-indigo-200' : 'text-indigo-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[11px] truncate leading-tight">{table.name}</div>
                        <div className={`text-[9px] font-medium truncate mt-0.5 ${selectedTargetTable === table.name ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {mockColumns[table.name]?.length || 0} trường
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI - Danh sách Trường */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-100/50 p-3 rounded-xl border border-slate-200/50">
              <div className="relative mb-3 shrink-0">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm trường..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                {targetFields.map((field, idx) => (
                  <div key={idx} className={`p-2 rounded-lg border bg-white transition-all cursor-pointer group ${field.name === 'DIP_RefId' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 shadow-sm'}`}>
                    <div className="flex items-start gap-2.5">
                      <div className="pt-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${field.name === 'DIP_RefId' ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-500'}`}>
                          {field.name === 'DIP_RefId' && (
                            <svg className="w-2 h-2 text-white" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-[11px] text-slate-800 truncate">{field.name}</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-medium">
                          Type: <span className="text-slate-700">{field.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
