import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronDown, ChevronRight, X, User, Calendar, Users, 
  Database, Plus, Search, Check, FileJson, Trash2, LayoutTemplate
} from 'lucide-react';

// === MOCK DATA FOR SOURCE (XML Tree Structure) ===
const sourceStructure = [
  {
    groupId: 'root',
    groupName: 'Thông tin chung (Root)',
    fields: [
      { path: 'Root.citizenFullName', name: 'citizenFullName', type: 'str' },
      { path: 'Root.citizenPin', name: 'citizenPin', type: 'str' },
      { path: 'Root.citizenIdentifyNo', name: 'citizenIdentifyNo', type: 'str' },
      { path: 'Root.identifyNo', name: 'identifyNo', type: 'str' },
      { path: 'Root.passPortNo', name: 'passPortNo', type: 'str' },
      { path: 'Root.citizenBirthDate', name: 'citizenBirthDate', type: 'date' }
    ]
  },
  {
    groupId: 'birth',
    groupName: 'Khai sinh (birthRegistrations)',
    fields: [
      { path: 'Root.birthRegistrations.numberNo', name: 'numberNo', type: 'str' },
      { path: 'Root.birthRegistrations.bookNo', name: 'bookNo', type: 'str' },
      { path: 'Root.birthRegistrations.pageNo', name: 'pageNo', type: 'str' },
      { path: 'Root.birthRegistrations.momPin', name: 'momPin', type: 'str' },
      { path: 'Root.birthRegistrations.momFullName', name: 'momFullName', type: 'str' },
      { path: 'Root.birthRegistrations.momBirthDate', name: 'momBirthDate', type: 'date' },
      { path: 'Root.birthRegistrations.dadPin', name: 'dadPin', type: 'str' },
      { path: 'Root.birthRegistrations.dadFullName', name: 'dadFullName', type: 'str' },
      { path: 'Root.birthRegistrations.dadBirthDate', name: 'dadBirthDate', type: 'date' },
      { path: 'Root.birthRegistrations.registrationDate', name: 'registrationDate', type: 'date' },
      { path: 'Root.birthRegistrations.registrationPlace', name: 'registrationPlace', type: 'str' }
    ]
  },
  {
    groupId: 'marriage',
    groupName: 'Kết hôn (marriageRegistrations)',
    fields: [
      { path: 'Root.marriageRegistrations.bookNo', name: 'bookNo', type: 'str' },
      { path: 'Root.marriageRegistrations.pageNo', name: 'pageNo', type: 'str' },
      { path: 'Root.marriageRegistrations.registrationDate', name: 'registrationDate', type: 'date' },
      { path: 'Root.marriageRegistrations.registrationPlace', name: 'registrationPlace', type: 'str' },
      { path: 'Root.marriageRegistrations.numberNo', name: 'numberNo', type: 'str' },
      { path: 'Root.marriageRegistrations.hbPin', name: 'hbPin', type: 'str' },
      { path: 'Root.marriageRegistrations.hbFullName', name: 'hbFullName', type: 'str' },
      { path: 'Root.marriageRegistrations.hbBirthDate', name: 'hbBirthDate', type: 'date' },
      { path: 'Root.marriageRegistrations.wfPin', name: 'wfPin', type: 'str' },
      { path: 'Root.marriageRegistrations.wfFullName', name: 'wfFullName', type: 'str' },
      { path: 'Root.marriageRegistrations.wfBirthDate', name: 'wfBirthDate', type: 'date' }
    ]
  }
];

// === MOCK DATA FOR TARGET DATABASE CLASSES ===
const availableDBTables = [
  {
    id: 'citizen_info', name: 'Thông tin công dân', schemaTable: 'public.citizen_info', icon: User,
    schemaFields: [
      { name: 'id', type: 'uuid', req: true, desc: 'Khóa chính' },
      { name: 'full_name', type: 'varchar(255)', req: true, desc: 'Họ và tên' },
      { name: 'citizen_pin', type: 'varchar(12)', req: false, desc: 'Mã số cá nhân định danh' },
      { name: 'identify_no', type: 'varchar(12)', req: false, desc: 'Số CMND' },
      { name: 'passport_no', type: 'varchar(20)', req: false, desc: 'Số Hộ chiếu' },
      { name: 'birth_date', type: 'date', req: false, desc: 'Ngày tháng năm sinh' },
    ]
  },
  {
    id: 'birth_regs', name: 'Khai sinh', schemaTable: 'public.birth_registrations', icon: Calendar,
    schemaFields: [
      { name: 'id', type: 'uuid', req: true, desc: 'Khóa chính' },
      { name: 'number_no', type: 'varchar(50)', req: true, desc: 'Số đăng ký khai sinh' },
      { name: 'book_no', type: 'varchar(50)', req: false, desc: 'Số quyển' },
      { name: 'mother_full_name', type: 'varchar(255)', req: false, desc: 'Họ tên mẹ' },
      { name: 'father_full_name', type: 'varchar(255)', req: false, desc: 'Họ tên cha' },
      { name: 'reg_date', type: 'date', req: false, desc: 'Ngày đăng ký' },
      { name: 'reg_place', type: 'varchar(255)', req: false, desc: 'Nơi đăng ký' },
    ]
  },
  {
    id: 'marriage_regs', name: 'Kết hôn', schemaTable: 'public.marriage_registrations', icon: Users,
    schemaFields: [
      { name: 'id', type: 'uuid', req: true, desc: 'Khóa chính' },
      { name: 'cert_number', type: 'varchar(50)', req: true, desc: 'Số ĐKKH' },
      { name: 'husband_name', type: 'varchar(255)', req: true, desc: 'Họ tên chồng' },
      { name: 'wife_name', type: 'varchar(255)', req: true, desc: 'Họ tên vợ' },
      { name: 'reg_date', type: 'date', req: false, desc: 'Ngày đăng ký' },
      { name: 'reg_place', type: 'varchar(255)', req: false, desc: 'Nơi đăng ký' },
    ]
  }
];

export function AdvancedDataMapping() {
  const [sourceTree, setSourceTree] = useState(
    sourceStructure.map(g => ({ ...g, isExpanded: true }))
  );
  
  // Trạng thái các bảng đích
  const [activeTables, setActiveTables] = useState<any[]>([]);
  
  const [showTableSelect, setShowTableSelect] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const selRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Khởi tạo ban đầu
    const initialTable = availableDBTables.find(t => t.id === 'citizen_info');
    if (initialTable && activeTables.length === 0) {
      addTableToMapping(initialTable);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selRef.current && !selRef.current.contains(event.target as Node)) {
        setShowTableSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selRef]);

  const toggleSourceGroup = (groupId: string) => {
    setSourceTree(tree => tree.map(g => g.groupId === groupId ? { ...g, isExpanded: !g.isExpanded } : g));
  };

  const removeActiveTable = (instanceId: string) => {
    setActiveTables(tables => tables.filter(t => t.instanceId !== instanceId));
  };

  const toggleActiveTable = (instanceId: string) => {
    setActiveTables(tables => tables.map(t => t.instanceId === instanceId ? { ...t, isExpanded: !t.isExpanded } : t));
  };

  const addTableToMapping = (tableDef: typeof availableDBTables[0]) => {
    const newInstance = {
      instanceId: tableDef.id + '_' + Date.now(),
      ...tableDef,
      isExpanded: true,
      mappings: {} as Record<string, string>
    };
    setActiveTables(prev => [newInstance, ...prev]);
    setShowTableSelect(false);
    setTableSearch('');
  };

  const updateMapping = (tableInstanceId: string, targetField: string, sourcePath: string) => {
    setActiveTables(tables => tables.map(t => {
      if (t.instanceId === tableInstanceId) {
        return {
          ...t,
          mappings: {
            ...t.mappings,
            [targetField]: sourcePath
          }
        };
      }
      return t;
    }));
  };

  const flatSources = useMemo(() => sourceStructure.flatMap(g => g.fields), []);

  const handleAutoMap = (tableInstanceId: string) => {
    setActiveTables(tables => tables.map(t => {
      if (t.instanceId === tableInstanceId) {
        const newMappings = { ...t.mappings };
        t.schemaFields.forEach((field: any) => {
          if (field.name === 'id' || newMappings[field.name]) return;
          
          const fieldSnake = field.name.toLowerCase();
          let match = flatSources.find(sf => {
            const srcLower = sf.name.toLowerCase();
            return srcLower === fieldSnake || 
                   srcLower.includes(fieldSnake.replace('_', '')) || 
                   fieldSnake.includes(srcLower);
          });
          
          if (!match) {
            if (field.name === 'full_name') match = flatSources.find(f => f.name === 'citizenFullName');
            if (field.name === 'mother_full_name') match = flatSources.find(f => f.name === 'momFullName');
            if (field.name === 'father_full_name') match = flatSources.find(f => f.name === 'dadFullName');
            if (field.name === 'reg_date') match = flatSources.find(f => f.name === 'registrationDate');
            if (field.name === 'reg_place') match = flatSources.find(f => f.name === 'registrationPlace');
            if (field.name === 'cert_number') match = flatSources.find(f => f.name === 'numberNo' && f.path.includes('marriage'));
            if (field.name === 'husband_name') match = flatSources.find(f => f.name === 'hbFullName');
            if (field.name === 'wife_name') match = flatSources.find(f => f.name === 'wfFullName');
          }

          if (match) {
            newMappings[field.name] = match.path;
          }
        });
        return { ...t, mappings: newMappings, isExpanded: true };
      }
      return t;
    }));
  };

  const autoMapAll = () => {
    activeTables.forEach(t => handleAutoMap(t.instanceId));
  };
  
  // Lấy tổng số lần đã được map
  const getSourceMapCount = (path: string) => {
    return activeTables.reduce((acc, t) => {
      const uses = Object.values(t.mappings).filter(v => v === path).length;
      return acc + uses;
    }, 0);
  };

  const mappedSourcePaths = useMemo(() => {
    const paths = new Set<string>();
    activeTables.forEach(t => {
      Object.values(t.mappings).forEach((path: any) => {
        if (typeof path === 'string' && path !== '') paths.add(path);
      });
    });
    return paths;
  }, [activeTables]);

  const allSourcesMapped = flatSources.every(sf => mappedSourcePaths.has(sf.path));

  return (
    <div className="bg-slate-50 flex flex-col items-center w-full min-h-[600px] border border-slate-200 rounded-lg overflow-hidden">
      
      {/* HEADER MAIN VIEW */}
      <div className="w-full px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Cấu hình ánh xạ dữ liệu đích (Data Mapping)</h2>
          <div className="flex items-center gap-2 mt-0.5">
             <p className="text-[11px] text-slate-500 hidden sm:block">Một trường nguồn (XML) có thể được ánh xạ vào nhiều bảng/trường đích khác nhau.</p>
             <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-[3px] rounded font-medium border border-slate-200 shadow-sm leading-none flex gap-1">
               <strong className={mappedSourcePaths.size > 0 ? 'text-green-600' : ''}>{mappedSourcePaths.size}</strong> / {flatSources.length} nguồn đã ánh xạ
             </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {activeTables.length > 0 && (
             <button type="button" onClick={autoMapAll} className="px-3 py-1.5 border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded text-xs font-medium transition-colors shadow-sm">
               Tự động ánh xạ tất cả
             </button>
           )}
           <button 
             type="button" 
             disabled={!allSourcesMapped}
             className="px-4 py-1.5 bg-slate-900 border border-slate-900 rounded text-xs font-medium text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:border-slate-300 transition-colors shadow-sm"
             title={!allSourcesMapped ? 'Bạn phải ánh xạ tất cả các trường dữ liệu nguồn để Lưu' : ''}
           >
             Lưu cấu hình
           </button>
        </div>
      </div>

      <div className="flex w-full flex-1 overflow-hidden">
        
        {/* ================= LEFT COLUMN: SOURCE (XML) ================= */}
        <div className="w-[35%] lg:w-[30%] bg-white border-r border-slate-200 flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10 min-h-[500px]">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between z-10">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-emerald-600" />
              Dữ liệu nguồn (XML)
            </h3>
            <span className="text-[9px] bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">Xanh = Đã ánh xạ</span>
          </div>

          <div className="p-2 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
            {sourceTree.map(group => {
              const mappedInGroup = group.fields.filter(f => mappedSourcePaths.has(f.path)).length;
              
              return (
                 <div key={group.groupId} className="border border-slate-200 bg-white rounded-md overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                   <button 
                    type="button"
                    onClick={() => toggleSourceGroup(group.groupId)}
                    className="w-full flex items-center justify-between px-2 py-2 hover:bg-slate-50 transition-colors focus:outline-none"
                   >
                     <div className="flex items-center gap-1.5">
                       <span className="w-4 h-4 flex items-center justify-center text-slate-400">
                         {group.isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                       </span>
                       <span className="text-xs font-bold text-slate-700 truncate">{group.groupName}</span>
                     </div>
                     <div className="flex text-[9px] font-bold text-slate-500 whitespace-nowrap ml-1">
                       <span className="px-1.5 py-0.5 bg-slate-100 rounded-sm border border-slate-200 leading-none flex items-center">
                         <span className={mappedInGroup > 0 ? "text-green-600 pr-[2px]" : "pr-[2px]"}>{mappedInGroup}</span> / {group.fields.length} đã ánh xạ
                       </span>
                     </div>
                   </button>
                   
                   {group.isExpanded && (
                     <div className="py-1 pl-2 pr-2 border-t border-slate-100 bg-[#fbfcfd]">
                       {group.fields.map(field => {
                         const mapCount = getSourceMapCount(field.path);
                         const isMapped = mapCount > 0;
                         return (
                           <div key={field.path} className={`flex items-center justify-between py-1 group pl-4 relative rounded mb-0.5 transition-colors ${isMapped ? 'bg-green-50/70 border border-green-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                             {/* Tree tracking lines */}
                             <div className={`absolute left-[5px] top-0 bottom-0 border-l ${isMapped ? 'border-green-300' : 'border-slate-200'}`}></div>
                             <div className={`absolute left-[5px] top-[10px] w-2.5 border-t ${isMapped ? 'border-green-300' : 'border-slate-200'}`}></div>
                             
                             <div className="flex items-center gap-1.5 pr-2">
                               <span className={`text-[10px] font-mono leading-[14px] ${isMapped ? 'font-bold text-green-700' : 'text-slate-600'}`}>{field.name}</span>
                               {isMapped && (
                                 <span className="bg-green-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] font-bold shadow-sm shrink-0" title="Số lần được ánh xạ">
                                   {mapCount}
                                 </span>
                               )}
                             </div>
                             <span className={`px-1 py-[1px] rounded border text-[8px] font-mono uppercase leading-none truncate max-w-[32px] text-center ${isMapped ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white text-slate-400 border-slate-200'}`}>
                               {field.type}
                             </span>
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: TARGET TABLES INLINE ================= */}
        <div className="w-[65%] lg:w-[70%] flex flex-col bg-[#f4f7f9]">
          
          {/* Header & Target Search Box */}
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between z-10 sticky top-0 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
             <div>
                <h3 className="text-xs font-bold text-slate-800">Cấu hình Bảng đích (Database)</h3>
             </div>
             
             {/* Combobox */}
             <div className="relative w-64" ref={selRef}>
               <div className="relative">
                 <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text"
                   className={`w-full pl-7 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 ${tableSearch ? 'pr-7' : 'pr-3'}`}
                   placeholder="Tìm / Thêm bảng CSDL mới..."
                   value={tableSearch}
                   onChange={(e) => { setTableSearch(e.target.value); setShowTableSelect(true); }}
                   onFocus={() => setShowTableSelect(true)}
                 />
                 {tableSearch && (
                   <button type="button" onClick={() => setTableSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 focus:outline-none">
                     <X className="w-3.5 h-3.5" />
                   </button>
                 )}
               </div>
               
               {/* Dropdown Options */}
               {showTableSelect && (
                 <div className="absolute right-0 top-full mt-1 w-full bg-white rounded shadow-lg border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-100">
                   <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                     {availableDBTables
                       .filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()) || t.schemaTable.toLowerCase().includes(tableSearch.toLowerCase()))
                       .map(table => {
                         const isSelected = activeTables.some(tt => tt.schemaTable === table.schemaTable);
                         return (
                           <button
                             type="button"
                             key={table.id}
                             onClick={() => { if(!isSelected) addTableToMapping(table); }}
                             className={`w-full text-left px-2.5 py-1.5 rounded-sm flex items-center justify-between mb-0.5 ${isSelected ? 'bg-slate-50 opacity-60 cursor-default' : 'hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-100'}`}
                           >
                             <div className="flex flex-col">
                               <span className={`text-[11px] font-bold ${isSelected ? 'text-slate-500' : 'text-slate-800'}`}>{table.name}</span>
                               <span className="text-[10px] font-mono text-slate-400 leading-none">{table.schemaTable}</span>
                             </div>
                             {isSelected ? <Check className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5 text-blue-500" />}
                           </button>
                         )
                     })}
                   </div>
                 </div>
               )}
             </div>
          </div>

          <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar pb-12">
            {activeTables.map((table) => {
              const Icon = table.icon;
              const mappedCount = Object.keys(table.mappings).filter(k => table.mappings[k] !== '').length;
              const totalCount = table.schemaFields.length;
              const isAllMapped = mappedCount > 0 && mappedCount >= totalCount;
              const badgeClass = isAllMapped ? 'bg-green-100 text-green-700' : (mappedCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600');

              return (
                <div key={table.instanceId} className={`bg-white border rounded-md shadow-sm transition-all overflow-hidden ${table.isExpanded ? 'border-indigo-200' : 'border-slate-200'}`}>
                  
                  {/* Table Card Header */}
                  <div 
                    className={`flex items-center justify-between p-2 ${table.isExpanded ? 'bg-[#f8f9fc] border-b border-indigo-100' : 'hover:bg-slate-50 cursor-pointer'} transition-colors`}
                    onClick={() => !table.isExpanded && toggleActiveTable(table.instanceId)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded bg-white border border-slate-100 shadow-sm ${isAllMapped ? 'text-green-600' : 'text-indigo-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[12px] font-bold text-slate-800 leading-tight">{table.name}</h4>
                        <span className="text-[9px] font-mono text-slate-500">{table.schemaTable}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide ${badgeClass}`}>
                        {mappedCount}/{totalCount} ĐÃ ÁNH XẠ
                      </span>
                      <button type="button" onClick={() => handleAutoMap(table.instanceId)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors shadow-sm">
                         Tự động ánh xạ
                      </button>
                      
                      <div className="w-px h-3.5 bg-slate-200 mx-0.5"></div>

                      <button type="button" onClick={() => toggleActiveTable(table.instanceId)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors focus:outline-none">
                        {table.isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                      <button type="button" onClick={() => removeActiveTable(table.instanceId)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors focus:outline-none">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Expanded Mapping Body */}
                  {table.isExpanded && (
                    <div className="bg-white">
                      <div className="grid grid-cols-[1fr_20px_1.5fr] gap-2 px-3 py-1.5 border-b border-slate-100 bg-slate-50/80">
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider pl-1">Trường Đích (Database)</div>
                        <div></div>
                        <div className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider">Chọn từ XML</div>
                      </div>
                      
                      <div className="p-2 space-y-1">
                        {table.schemaFields.map((field: any, idx: number) => {
                          const currentMappedPath = table.mappings[field.name] || '';
                          const isMapped = currentMappedPath !== '';
                          
                          return (
                            <div key={idx} className={`grid grid-cols-[1fr_20px_1.5fr] gap-2 items-center px-2.5 py-1.5 border rounded transition-all ${isMapped ? 'border-green-300/60 bg-[#f8fdf9]' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                              
                              {/* Left: DB Target Field Compact */}
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[11px] font-mono font-bold ${isMapped ? 'text-green-800' : 'text-slate-700'}`}>{field.name}</span>
                                  {field.req && <span className="px-1 py-[1px] rounded-[2px] bg-red-100 text-red-600 text-[7px] font-extrabold uppercase leading-none mt-[1px]">*</span>}
                                </div>
                                <span className="text-[8px] text-slate-400 mt-[2px] truncate">{field.type} - {field.desc}</span>
                              </div>
                              
                              {/* Arrow icon */}
                              <div className="flex justify-center flex-col items-center">
                                <span className={`text-[14px] leading-none text-slate-300 mt-[-2px]`}>←</span>
                              </div>
                              
                              {/* Right: Select Box Compact */}
                              <div className="relative">
                                <select 
                                  className={`w-full pl-2 pr-6 py-1 border rounded text-[10px] font-medium appearance-none focus:outline-none focus:border-indigo-400 transition-colors shadow-sm ${isMapped ? 'border-green-300 bg-white text-green-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                  value={currentMappedPath}
                                  onChange={(e) => updateMapping(table.instanceId, field.name, e.target.value)}
                                >
                                  <option value="">[ Chọn trường Nguồn ]</option>
                                  {sourceStructure.map(group => (
                                    <optgroup key={group.groupId} label={`--- ${group.groupName} ---`}>
                                      {group.fields.map(sf => (
                                        <option key={sf.path} value={sf.path}>{sf.name}</option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </select>
                                <ChevronDown className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${isMapped ? 'text-green-500' : 'text-slate-400'}`} />
                                
                                {isMapped && (
                                  <button 
                                    type="button" 
                                    onClick={(e) => { e.stopPropagation(); updateMapping(table.instanceId, field.name, ''); }} 
                                    className="absolute right-5 top-1/2 -translate-y-1/2 p-[2px] text-slate-400 hover:text-red-500 transition-colors pointer-events-auto bg-white rounded"
                                    title="Hủy ánh xạ"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {activeTables.length === 0 && (
               <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded mx-1 bg-white">
                 <Database className="w-6 h-6 mb-1 text-slate-300" />
                 <p className="font-bold text-slate-500 text-xs">Chưa có Bảng đích nào</p>
                 <p className="text-[10px] mt-0.5">Tìm và chọn bảng từ hộp tìm kiếm phía trên.</p>
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* GLOBAL STYLES FOR SCROLLBAR IN THIS COMPONENT */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}
