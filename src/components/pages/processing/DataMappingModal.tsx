import React, { useState } from 'react';
import { X, Database, Search, TableProperties, Save, Merge, ArrowLeftRight, SquarePen, Trash2, Split, Check, Sparkles } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';
import { TargetDatabase, mockTables, mockColumns } from './mockTargetDatabases';
import { MergeSplitModal } from './MergeSplitModal';

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
  const [selectedSourceFields, setSelectedSourceFields] = useState<string[]>([]);
  const [isMergeSplitModalOpen, setIsMergeSplitModalOpen] = useState(false);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [editingField, setEditingField] = useState<any>(null);
  
  // Mapping logic state
  const [activeSourceField, setActiveSourceField] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({}); // { sourceFieldName: targetFieldName }
  const [isAutoMapped, setIsAutoMapped] = useState(false);

  const sourceFields = [
    { name: 'DIP_RefId', type: 'VARCHAR', length: '4000', nullable: true },
    { name: 'ID', type: 'INT', isPk: true },
    { name: 'HOTEN', type: 'NVARCHAR', length: '255' },
    { name: 'NGAYSINH', type: 'DATE' },
    { name: 'GIOITINH', type: 'VARCHAR', length: '10' },
    ...customFields
  ];

  const handleMergeSubmit = (data: any) => {
    if (editingField) {
      setCustomFields(prev => prev.map(f => f.id === editingField.id ? {
        ...f,
        name: data.name,
        type: data.type,
        sourceInfo: `Nối bằng "${data.separator}" từ ${data.fields.join(', ')}`,
        raw: data
      } : f));
      setEditingField(null);
    } else {
      const newField = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        isCustom: true,
        mode: 'merge',
        sourceInfo: `Nối bằng "${data.separator}" từ ${data.fields.join(', ')}`,
        raw: data
      };
      setCustomFields(prev => [...prev, newField]);
    }
  };

  const handleSplitSubmit = (data: any) => {
    if (editingField) {
      // For split, it's more complex because one split creates multiple fields.
      // Usually "Edit" on a split field should probably edit the whole split group,
      // but for simplicity here we'll just update the one field's name/type
      // or re-generate if we want to be thorough.
      // Given the UI, let's just update the specific field.
      setCustomFields(prev => prev.map(f => f.id === editingField.id ? {
        ...f,
        name: data.targetRes?.name || f.name, // Split data structure is slightly different
        type: data.targetRes?.type || f.type,
        sourceInfo: `Tách bằng "${data.separator}" từ ${data.source}`,
        raw: { ...data, targetRes: data.targetRes || editingField.raw.targetRes }
      } : f));
      setEditingField(null);
    } else {
      const newFields = data.results.map((res: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        name: res.name,
        type: res.type,
        isCustom: true,
        mode: 'split',
        sourceInfo: `Tách bằng "${data.separator}" từ ${data.source}`,
        raw: { ...data, targetRes: res }
      }));
      setCustomFields(prev => [...prev, ...newFields]);
    }
  };

  const handleAutoMap = () => {
    // Replicate source fields exactly to target
    const newMappings: Record<string, string> = {};
    sourceFields.forEach(src => {
      newMappings[src.name] = src.name;
    });

    setMappings(newMappings);
    setIsAutoMapped(true);
    setSelectedTargetTable('AUTO_GENERATED_TABLE');
    setActiveSourceField(null);
  };

  const resetMapping = () => {
    setMappings({});
    setIsAutoMapped(false);
    setSelectedTargetTable('HS_KHAI_SINH');
  };

  const deleteCustomField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomFields(prev => prev.filter(f => f.id !== id));
    setSelectedSourceFields(prev => prev.filter(f => f !== id)); // If ID was used as name
  };

  const targetFields = isAutoMapped 
    ? sourceFields.map(f => ({ ...f, length: f.length || '-' })) 
    : (mockColumns[selectedTargetTable] || []);

  const toggleSourceField = (fieldName: string) => {
    setActiveSourceField(prev => prev === fieldName ? null : fieldName);
  };

  const handleTargetFieldSelect = (targetFieldName: string) => {
    if (isAutoMapped) {
      alert('Đang trong chế độ tự động ánh xạ. Vui lòng đặt lại nếu muốn chỉnh sửa thủ công.');
      return;
    }

    if (!activeSourceField) {
      alert('Vui lòng chọn một trường nguồn trước khi ánh xạ!');
      return;
    }

    // Check if target is already mapped to ANOTHER source
    const existingMapping = Object.entries(mappings).find(([src, tgt]) => tgt === targetFieldName && src !== activeSourceField);
    if (existingMapping) {
      alert(`Trường '${targetFieldName}' đã được ánh xạ cho trường nguồn '${existingMapping[0]}'. Ánh xạ là 1-1.`);
      return;
    }

    if (isAutoMapped) return;
    setMappings(prev => ({
      ...prev,
      [activeSourceField]: targetFieldName
    }));
  };

  const unmapField = (sourceFieldName: string, e: React.MouseEvent) => {
    if (isAutoMapped) return;
    e.stopPropagation();
    const newMappings = { ...mappings };
    delete newMappings[sourceFieldName];
    setMappings(newMappings);
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full px-6 py-4 bg-white border-t border-slate-100 rounded-b-2xl">
      <button
        type="button"
        onClick={onClose}
        style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
        className="text-[13px] text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
      >
        Hủy
      </button>
      <button
        type="button"
        onClick={() => {
          alert('Đã lưu cấu hình ánh xạ!');
          onClose();
        }}
        style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
        className="text-[13px] text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-95"
      >
        Lưu cấu hình
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Ánh xạ dữ liệu"
      subtitle="Liên kết bảng nguồn với CSDL Kho dữ liệu dùng chung"
      maxWidth="max-w-5xl"
      className="force-13px"
      showCloseButton={true}
      headerActions={
        <div className="flex items-center gap-2">
          <button 
            onClick={isAutoMapped ? resetMapping : handleAutoMap}
            style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: 500 }}
            className={`flex items-center gap-1.5 transition-all shadow-sm text-[12px] ${isAutoMapped ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100' : 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100'}`}
            title={isAutoMapped ? "Hủy chế độ tự động" : "Tự động tạo bảng và ánh xạ 1-1"}
          >
            {isAutoMapped ? <X className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isAutoMapped ? 'Hủy tự động' : 'Tự động ánh xạ'}
          </button>
          <button 
            onClick={() => setIsMergeSplitModalOpen(true)}
            style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: 500 }}
            className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] text-[#020817] hover:bg-slate-50 transition-all shadow-sm text-[12px]"
          >
            <Merge className="w-3.5 h-3.5" />
            Gộp / Tách cột
          </button>
        </div>
      }
      customHeaderIcon={
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
      }
      footer={footer}
    >
      <div className="flex gap-6 h-[520px] min-h-0 py-2">
        {/* CỘT 1 - Dữ liệu thu thập */}
        <div className="w-[380px] shrink-0 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800" style={{ fontSize: '18px' }}>Dữ liệu cần xử lý</h3>
                <p className="text-slate-500 font-medium" style={{ fontSize: '12px' }}>Bộ dữ liệu hồ sơ đăng ký khai sinh</p>
              </div>
            </div>
          </div>

          <div className="relative mb-4 shrink-0 px-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Lọc cột..."
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-blue-400 focus:ring-0 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar px-1">
            {sourceFields.filter(f => f.name.toLowerCase().includes(sourceSearch.toLowerCase())).map((field, idx) => {
              const isMapped = !!mappings[field.name];
              const isActive = activeSourceField === field.name;
              const isCustom = field.isCustom;
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleSourceField(field.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${isActive ? 'border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-500/10' : isMapped ? 'border-green-200 bg-green-50/30' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                >
                  <div className="flex items-start gap-[10px]">
                    <div className="pt-0.5">
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${isMapped ? 'bg-green-600 border-green-600' : isActive ? 'bg-blue-600 border-blue-600 shadow-sm' : 'border-slate-200 bg-white group-hover:border-blue-400'}`}>
                        {isMapped ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : isActive && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[13px] text-slate-800 truncate">{field.name}</span>
                        {field.isPk && (
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold border border-slate-200">
                            <Database className="w-2.5 h-2.5 mr-1" /> PK
                          </span>
                        )}
                        {isCustom && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${field.mode === 'merge' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {field.mode === 'merge' ? (
                              <><Merge className="w-2.5 h-2.5 mr-1" /> Gộp</>
                            ) : (
                              <><Split className="w-2.5 h-2.5 mr-1" /> Tách</>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                        <span>Kiểu: <span className="text-slate-700">{field.type}</span></span>
                        {field.length && <span>Độ dài: {field.length}</span>}
                        {field.nullable && <span className="italic">Cho phép Null: true</span>}
                      </div>
                      {field.sourceInfo && (
                        <p className="text-[10px] text-orange-600/80 mt-1 font-medium italic">{field.sourceInfo}</p>
                      )}
                      {isMapped && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                          <span className="text-slate-400">Đã ánh xạ tới:</span>
                          <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                            {mappings[field.name]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {isMapped && (
                      <button 
                        onClick={(e) => unmapField(field.name, e)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Bỏ ánh xạ"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isCustom && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingField(field); setIsMergeSplitModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <SquarePen className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => deleteCustomField(field.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dải phân cách dọc */}
        <div className="w-px bg-slate-100 h-full self-stretch" />

        {/* PHẦN BÊN PHẢI - Dữ liệu xử lý */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 mb-4 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800" style={{ fontSize: '18px' }}>Cơ sở dữ liệu xử lý</h3>
              <p className="text-slate-500 font-medium" style={{ fontSize: '12px' }}>Bảng đích & các trường</p>
            </div>
          </div>

          <div className="flex-1 flex gap-4 min-h-0">
            {/* CỘT GIỮA - Danh sách Bảng */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="relative mb-4 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lọc bảng..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-blue-400 focus:ring-0 transition-all"
                />
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {isAutoMapped ? (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 flex flex-col items-center justify-center text-center">
                    <Database className="w-8 h-8 text-emerald-500 mb-2" />
                    <div className="font-bold text-[13px] text-emerald-800 italic">Bảng tự động tạo</div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-medium">Cấu trúc khớp 100% với nguồn</div>
                  </div>
                ) : (
                  mockTables.filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase())).map((table, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedTargetTable(table.name)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedTargetTable === table.name ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-800'}`}
                    >
                      <div className="flex items-start gap-[10px]">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${selectedTargetTable === table.name ? 'bg-white/20' : 'bg-indigo-50 text-indigo-500'}`}>
                          <TableProperties className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[13px] truncate leading-tight">{table.name}</div>
                          <div className={`text-[10px] font-medium truncate mt-1 ${selectedTargetTable === table.name ? 'text-blue-50' : 'text-slate-500'}`}>
                            {table.name} - {mockColumns[table.name]?.length || 0} trường
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CỘT PHẢI - Danh sách Trường */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="relative mb-4 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lọc cột..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-blue-400 focus:ring-0 transition-all"
                />
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {targetFields.filter(f => f.name.toLowerCase().includes(fieldSearch.toLowerCase())).map((field, idx) => {
                  const mappedToSource = Object.entries(mappings).find(([_, tgt]) => tgt === field.name)?.[0];
                  const isSelected = !!mappedToSource;
                  const isCurrentSelection = activeSourceField ? mappings[activeSourceField] === field.name : false;

                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleTargetFieldSelect(field.name)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer group shadow-sm hover:shadow-md ${isCurrentSelection ? 'border-blue-500 bg-blue-50/40' : isSelected ? 'border-green-100 bg-green-50/20 opacity-80' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                    >
                      <div className="flex items-start gap-[10px]">
                        <div className="pt-0.5">
                          <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${isCurrentSelection ? 'bg-blue-600 border-blue-600' : isSelected ? 'bg-green-600 border-green-600' : 'border-slate-200 bg-white group-hover:border-blue-400'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[13px] text-slate-800 truncate">{field.name}</span>
                            {field.isPk && <span className="text-[10px] text-slate-400 font-bold uppercase">PK</span>}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                            <span>Kiểu: <span className="text-slate-700 uppercase">{field.type}</span></span>
                            {field.length && <span>Độ dài: {field.length}</span>}
                            {field.nullable && <span className="italic">Cho phép Null: true</span>}
                          </div>
                          {isSelected && (
                            <div className="mt-2 text-[10px] text-slate-500">
                              Ánh xạ từ: <span className="font-bold text-slate-700">{mappedToSource}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MergeSplitModal 
        isOpen={isMergeSplitModalOpen}
        onClose={() => { setIsMergeSplitModalOpen(false); setEditingField(null); }}
        sourceFields={sourceFields.filter(f => !f.isCustom)}
        onMergeSubmit={handleMergeSubmit}
        onSplitSubmit={handleSplitSubmit}
        initialData={editingField?.raw}
        mode={editingField?.mode}
      />
    </BaseModal>
    </div>
  );
}
