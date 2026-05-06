import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronDown, ChevronRight, X, User, Calendar, Users,
  Database, Plus, Search, Check, FileJson, Trash2, LayoutTemplate,
  CheckCircle, Send
} from 'lucide-react';

export function AdvancedDataMapping({ onClose }: { onClose?: () => void }) {

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


  const [sourceTree, setSourceTree] = useState(
    sourceStructure.map(g => ({ ...g, isExpanded: true }))
  );

  // Trạng thái các bảng đích
  const [activeTables, setActiveTables] = useState<any[]>([]);

  const [showTableSelect, setShowTableSelect] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('https://api.example.com/data');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const selRef = useRef<HTMLDivElement | null>(null);

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

  const calculateAutoMappings = (schemaFields: any[]) => {
    const flatSrc = sourceStructure.flatMap(g => g.fields);
    const newMappings: Record<string, string> = {};
    schemaFields.forEach((field: any) => {
      if (field.name === 'id') return;

      const fieldSnake = field.name.toLowerCase();
      let match = flatSrc.find(sf => {
        const srcLower = sf.name.toLowerCase();
        return srcLower === fieldSnake ||
          srcLower.includes(fieldSnake.replace('_', '')) ||
          fieldSnake.includes(srcLower);
      });

      if (!match) {
        if (field.name === 'full_name') match = flatSrc.find(f => f.name === 'citizenFullName');
        if (field.name === 'mother_full_name') match = flatSrc.find(f => f.name === 'momFullName');
        if (field.name === 'father_full_name') match = flatSrc.find(f => f.name === 'dadFullName');
        if (field.name === 'reg_date') match = flatSrc.find(f => f.name === 'registrationDate');
        if (field.name === 'reg_place') match = flatSrc.find(f => f.name === 'registrationPlace');
        if (field.name === 'cert_number') match = flatSrc.find(f => f.name === 'numberNo' && f.path.includes('marriage'));
        if (field.name === 'husband_name') match = flatSrc.find(f => f.name === 'hbFullName');
        if (field.name === 'wife_name') match = flatSrc.find(f => f.name === 'wfFullName');
      }

      if (match) {
        newMappings[field.name] = match.path;
      }
    });
    return newMappings;
  };

  const addTableToMapping = (tableDef: typeof availableDBTables[0]) => {
    const autoMappings = calculateAutoMappings(tableDef.schemaFields);
    const newInstance = {
      instanceId: tableDef.id + '_' + Date.now(),
      ...tableDef,
      isExpanded: true,
      mappings: autoMappings
    };
    setActiveTables(prev => [...prev, newInstance]);
    // Do not close dropdown or clear search to allow multiple selections
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
        const autoMapResults = calculateAutoMappings(t.schemaFields);
        return { ...t, mappings: { ...t.mappings, ...autoMapResults }, isExpanded: true };
      }
      return t;
    }));
  };

  const autoMapAll = () => {
    activeTables.forEach(t => handleAutoMap(t.instanceId));
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

  return (
    <div className="flex flex-col w-full h-full bg-slate-50">

      {/* HEADER INFO SECTION */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Cấu hình ánh xạ dữ liệu</h3>
          <p className="text-xs text-slate-500 mt-0.5">Kết nối đã được thiết lập. Nhấn Nạp cấu trúc để lấy danh sách bảng và trường.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsDataLoaded(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          disabled={isDataLoaded}
        >
          <Download className="w-4 h-4" />
          Nạp cấu trúc
        </button>
      </div>

      {isDataLoaded ? (
        <>
          <div className="flex justify-between items-center px-6 pt-4 shrink-0">
             <div className="text-sm text-slate-500 font-medium">Bản tin trả về hợp lệ. Bắt đầu thực hiện cấu hình ánh xạ bảng đích chi tiết.</div>
          </div>
          <div className="flex flex-1 overflow-hidden px-6 py-4 gap-6">

        {/* ================= LEFT COLUMN: SOURCE (XML) ================= */}
        <div className="w-[35%] lg:w-[32%] bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden z-10">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <FileJson className="w-4 h-4 text-emerald-600" />
              Dữ liệu nguồn (XML)
            </h3>
          </div>

          <div className="p-2 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
            {sourceTree.map(group => {
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
 <span className="text-xs text-slate-700 truncate">{group.groupName}</span>
 </div>
 </button>

                  {group.isExpanded && (
                    <div className="py-0 pb-1">
                      {group.fields.map(field => {
                        const isMapped = mappedSourcePaths.has(field.path);
                        return (
                          <div key={field.path} className="flex items-center justify-between py-1.5 px-3 mb-[1px] cursor-pointer hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${isMapped ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                              <span className="text-[12px] font-mono leading-tight text-slate-600">{field.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase leading-none text-slate-400 bg-slate-100`}>
                                {field.type}
                              </span>
                            </div>
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

        {/* ================= RIGHT COLUMN: TARGET DATABASE TREE ================= */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden z-10">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <Database className="w-4 h-4 text-blue-600" />
              Cấu hình bảng đích (DATABASE)
            </h3>
          </div>

          <div className="p-3 overflow-y-auto flex-1 custom-scrollbar pb-12">

            {/* Giả lập ROOT Node Tree */}
            <div className="flex border-l border-slate-200 ml-2 pl-3 flex-col space-y-1 relative">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-3 gap-4" ref={selRef}>
                <h4 className="text-sm font-bold text-slate-700 uppercase leading-none whitespace-nowrap">Hệ thống Đích</h4>
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Tìm và thiết lập bảng dữ liệu..."
                    value={tableSearch}
                    onFocus={() => setShowTableSelect(true)}
                    onChange={(e) => {
                      setTableSearch(e.target.value);
                      setShowTableSelect(true);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {/* Combobox Dropdown */}
                  {showTableSelect && (
                    <div className="absolute z-50 w-full right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                      {availableDBTables
                        .filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()) || t.schemaTable.toLowerCase().includes(tableSearch.toLowerCase()))
                        .map(t => {
                          const Icon = t.icon;
                          const activeInstance = activeTables.find(at => at.id === t.id);
                          const isChecked = !!activeInstance;

                          return (
                            <div
                              key={t.id}
                              className={`px-3 py-2 cursor-pointer flex items-center gap-3 border-b border-slate-100 last:border-b-0 transition-colors ${isChecked ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                              onMouseDown={(e) => {
                                e.preventDefault(); // keep focus on input
                                if (isChecked) {
                                  if (activeInstance) removeActiveTable(activeInstance.instanceId);
                                } else {
                                  addTableToMapping(t);
                                }
                              }}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`}>
                                {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </div>
                              <Icon className={`w-4 h-4 ${isChecked ? 'text-blue-500' : 'text-slate-400'}`} />
                              <div className="flex flex-col">
                                <span className={`text-[12px] font-bold ${isChecked ? 'text-slate-800' : 'text-slate-600'}`}>{t.name}</span>
                                <span className="text-[10px] font-mono text-slate-500 leading-none mt-0.5">{t.schemaTable}</span>
                              </div>
                            </div>
                          );
                        })}
                      {availableDBTables.filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()) || t.schemaTable.toLowerCase().includes(tableSearch.toLowerCase())).length === 0 && (
                        <div className="px-3 py-4 text-center text-xs text-slate-500">
                          Không tìm thấy bảng hoặc đã được thêm hết.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {activeTables.map((table) => {
                const Icon = table.icon;
                const isExpanded = table.isExpanded !== false;

                return (
                  <div key={table.instanceId} className="mb-2 relative pl-3 border-l border-slate-200 ml-1 transition-all">
                    {/* Tree line connector */}
                    <div className="absolute -left-[1px] top-4 w-3 border-t border-slate-200"></div>

                    {/* Table Tree Node */}
                    <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 border border-transparent transition-colors group">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 border border-blue-500 bg-blue-500 rounded shadow-sm flex items-center justify-center cursor-pointer transition-colors"
                          onClick={() => removeActiveTable(table.instanceId)}
                          title="Gỡ bỏ bảng"
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>

                        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => toggleActiveTable(table.instanceId)}>
                          <button type="button" aria-label="Mở rộng/Thu gọn" className="p-0.5 text-slate-400 hover:text-slate-700 rounded focus:outline-none">
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                          <Icon className="w-4 h-4 text-blue-500" />
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-800">{table.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 leading-none">{table.schemaTable}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Xoá nhanh bảng trên Header */}
                      <button 
                        type="button" 
                        onClick={() => removeActiveTable(table.instanceId)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa cấu hình bảng này"
                      >
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Target Fields Inner Grid (Child of Tree) */}
                    {isExpanded && (
                      <div className="ml-6 pl-4 border-l border-slate-100 mt-1 mb-3">
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden w-full">
                          <div className="flex items-center gap-3 px-4 py-2 bg-[#f8f9fa] border-b border-slate-200">
                            <div className="w-[30%] text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trường Đích ({table.schemaTable})</div>
                            <div className="w-4"></div>
                            <div className="flex-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Trường Nguồn Select</div>
                          </div>

                          <div className="p-0 bg-white">
                            {table.schemaFields.map((field: any, idx: number) => {
                              const currentMappedPath = table.mappings[field.name] || '';
                              const isMapped = currentMappedPath !== '';

                              return (
                                <div key={idx} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 border-dashed hover:bg-slate-50/50 transition-colors last:border-b-0">

                                  {/* Left: DB Target Field Compact */}
                                  <div className="w-[30%] flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-[12px] font-mono font-bold ${isMapped ? 'text-slate-800' : 'text-slate-600'}`}>{field.name}</span>
                                      {field.req && <span className="text-red-500 text-[10px] font-bold leading-none mt-[-2px]">*</span>}
                                    </div>
                                    <span className="text-[9px] text-slate-400 mt-[1px]">{field.type}</span>
                                  </div>

                                  {/* Arrow icon */}
                                  <div className="w-4 flex justify-center flex-col items-center">
                                    <ChevronRight className={`w-3.5 h-3.5 ${isMapped ? 'text-blue-400' : 'text-slate-300'}`} />
                                  </div>

                                  {/* Right: Select Box Button Style */}
                                  <div className="flex-1 relative">
                                    <div className={`relative w-full border ${isMapped ? 'border-green-500/60 bg-green-50/50 ring-1 ring-green-500/20 shadow-[0_1px_2px_rgba(34,197,94,0.1)]' : 'border-slate-300 bg-slate-50 hover:bg-white'} rounded transition-all`}>
                                      <select
                                        aria-label="Chọn trường nguồn"
                                        className={`w-full pl-3 pr-8 py-1.5 text-[11px] font-bold appearance-none focus:outline-none bg-transparent cursor-pointer z-10 relative ${isMapped ? 'text-green-800' : 'text-slate-400 font-medium'}`}
                                        value={currentMappedPath}
                                        onChange={(e) => updateMapping(table.instanceId, field.name, e.target.value)}
                                      >
                                        <option value="" className="text-slate-500 font-normal">-- Chưa ánh xạ --</option>
                                        {sourceStructure.map(group => (
                                          <optgroup key={group.groupId} label={`--- ${group.groupName} ---`}>
                                            {group.fields.map(sf => (
                                              <option key={sf.path} value={sf.path}>{sf.name}</option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-0 pointer-events-none">
                                        {isMapped ? (
                                          <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
                                        ) : (
                                          <ChevronDown className="w-3 h-3 text-slate-400" />
                                        )}
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
      </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4 mt-[-5vh]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
            <Database className="w-8 h-8 text-slate-400 stroke-[1.5]" />
          </div>
          <p className="text-sm text-slate-600">Chưa có dữ liệu cấu trúc. Vui lòng nhấn "Nạp cấu trúc" để lấy thông tin bảng và trường.</p>
          <button
            type="button"
            onClick={() => setIsDataLoaded(true)}
            className="px-6 py-2.5 mt-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Nạp cấu trúc
          </button>
        </div>
      )}

      {/* Removed FOOTER VIEW since this will be in a tab */}

      {/* GLOBAL STYLES FOR SCROLLBAR IN THIS COMPONENT */}
      <style dangerouslySetInnerHTML={{
        __html: `
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
