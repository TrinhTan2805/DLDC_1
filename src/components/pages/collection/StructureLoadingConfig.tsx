import React, { useState, useMemo } from 'react';
import { Search, Database, FileText, Check, ChevronRight, Key } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_TABLES = [
  {
    id: 'citizen_info',
    name: 'citizen_info',
    fields: [
      { id: 'f1', name: 'id', dataType: 'uuid' },
      { id: 'f2', name: 'full_name', dataType: 'varchar(255)' },
      { id: 'f3', name: 'citizen_pin', dataType: 'varchar(12)' },
      { id: 'f4', name: 'identify_no', dataType: 'varchar(12)' },
      { id: 'f5', name: 'passport_no', dataType: 'varchar(20)' },
      { id: 'f6', name: 'birth_date', dataType: 'date' },
    ]
  },
  {
    id: 'birth_registrations',
    name: 'birth_registrations',
    fields: [
      { id: 'f7', name: 'id', dataType: 'uuid' },
      { id: 'f8', name: 'number_no', dataType: 'varchar(50)' },
      { id: 'f9', name: 'book_no', dataType: 'varchar(50)' },
      { id: 'f10', name: 'mother_full_name', dataType: 'varchar(255)' },
      { id: 'f11', name: 'father_full_name', dataType: 'varchar(255)' },
      { id: 'f12', name: 'reg_date', dataType: 'date' },
      { id: 'f13', name: 'reg_place', dataType: 'varchar(255)' },
    ]
  },
  {
    id: 'marriage_registrations',
    name: 'marriage_registrations',
    fields: [
      { id: 'f14', name: 'id', dataType: 'uuid' },
      { id: 'f15', name: 'cert_number', dataType: 'varchar(50)' },
      { id: 'f16', name: 'husband_name', dataType: 'varchar(255)' },
      { id: 'f17', name: 'wife_name', dataType: 'varchar(255)' },
      { id: 'f18', name: 'reg_date', dataType: 'date' },
      { id: 'f19', name: 'reg_place', dataType: 'varchar(255)' },
    ]
  }
];

export function StructureLoadingConfig() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchTable, setSearchTable] = useState('');
  const [searchField, setSearchField] = useState('');
  
  const [activeTableId, setActiveTableId] = useState<string>(MOCK_TABLES[0].id);

  // States lưu trữ cấu hình người dùng
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set()); // Lưu theo format `${tableId}.${fieldId}`
  
  // Field settings: allow_null, is_path_file, host_path_file, display_name
  const [fieldSettings, setFieldSettings] = useState<Record<string, any>>({});
  
  // Table settings: display_name
  const [tableSettings, setTableSettings] = useState<Record<string, any>>({});

  const filteredTables = useMemo(() => {
    return MOCK_TABLES.filter(t => t.name.toLowerCase().includes(searchTable.toLowerCase()));
  }, [searchTable]);

  const activeTable = MOCK_TABLES.find(t => t.id === activeTableId);

  const filteredFields = useMemo(() => {
    if (!activeTable) return [];
    return activeTable.fields.filter(f => f.name.toLowerCase().includes(searchField.toLowerCase()));
  }, [activeTable, searchField]);

  // --- Handlers for Fields ---
  const getFieldKey = (tableId: string, fieldId: string) => `${tableId}.${fieldId}`;

  // --- Handlers for Tables ---
  const toggleTableSelection = (tableId: string) => {
    const newSet = new Set(selectedTables);
    const newFieldsSet = new Set(selectedFields);
    
    if (newSet.has(tableId)) {
      newSet.delete(tableId);
      const table = MOCK_TABLES.find(t => t.id === tableId);
      if (table) {
        table.fields.forEach(f => newFieldsSet.delete(getFieldKey(tableId, f.id)));
      }
    } else {
      newSet.add(tableId);
      const table = MOCK_TABLES.find(t => t.id === tableId);
      if (table) {
        table.fields.forEach(f => newFieldsSet.add(getFieldKey(tableId, f.id)));
      }
    }
    setSelectedTables(newSet);
    setSelectedFields(newFieldsSet);
  };

  const toggleAllTables = () => {
    if (selectedTables.size === filteredTables.length) {
      setSelectedTables(new Set());
      setSelectedFields(new Set());
    } else {
      const newTablesSet = new Set<string>();
      const newFieldsSet = new Set<string>();
      filteredTables.forEach(t => {
        newTablesSet.add(t.id);
        t.fields.forEach(f => newFieldsSet.add(getFieldKey(t.id, f.id)));
      });
      setSelectedTables(newTablesSet);
      setSelectedFields(newFieldsSet);
    }
  };

  // Fields toggle handlers continued

  const toggleFieldSelection = (tableId: string, fieldId: string) => {
    const key = getFieldKey(tableId, fieldId);
    const newSet = new Set(selectedFields);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedFields(newSet);
  };

  const toggleAllFieldsInActiveTable = () => {
    if (!activeTable) return;
    const currentTableFieldKeys = filteredFields.map(f => getFieldKey(activeTable.id, f.id));
    const allSelected = currentTableFieldKeys.every(k => selectedFields.has(k));
    
    const newSet = new Set(selectedFields);
    if (allSelected) {
      currentTableFieldKeys.forEach(k => newSet.delete(k));
    } else {
      currentTableFieldKeys.forEach(k => newSet.add(k));
    }
    setSelectedFields(newSet);
  };

  const updateFieldSetting = (tableId: string, fieldId: string, key: string, value: any) => {
    const fieldKey = getFieldKey(tableId, fieldId);
    setFieldSettings(prev => {
      const newSettings = { ...prev };
      
      // Nếu đang đặt trường này làm Khóa chính, phải bỏ khóa chính ở các trường khác cùng bảng
      if (key === 'isPrimaryKey' && value === true) {
        Object.keys(newSettings).forEach(k => {
          if (k.startsWith(`${tableId}.`) && k !== fieldKey) {
            newSettings[k] = { ...newSettings[k], isPrimaryKey: false };
          }
        });
      }
      
      newSettings[fieldKey] = {
        ...(newSettings[fieldKey] || {}),
        [key]: value
      };
      
      return newSettings;
    });
  };

  const updateTableSetting = (tableId: string, key: string, value: any) => {
    setTableSettings(prev => ({
      ...prev,
      [tableId]: {
        ...(prev[tableId] || {}),
        [key]: value
      }
    }));
  };

  return (
    <div className="flex flex-col w-full h-[600px] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      
      {/* HEADER INFO SECTION */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Cấu hình bảng và trường</h3>
          <p className="text-sm text-slate-500 mt-0.5">Kết nối đã được thiết lập. Nhấn Nạp cấu trúc để lấy danh sách bảng và trường.</p>
        </div>
      </div>

      {isDataLoaded ? (
        <div className="flex flex-1 overflow-hidden">
          {/* CỘT TRÁI: DANH SÁCH BẢNG */}
          <div className="w-1/3 min-w-[300px] border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white shrink-0">
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Danh sách bảng
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bảng..." 
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="flex items-center gap-3 px-3 py-2 mb-1 border-b border-slate-200 pb-3">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={filteredTables.length > 0 && selectedTables.size === filteredTables.length}
              onChange={toggleAllTables}
            />
            <span className="text-base font-semibold text-slate-700">Chọn tất cả</span>
          </div>

          <div className="space-y-1">
            {filteredTables.map(table => {
              const isSelected = selectedTables.has(table.id);
              const isActive = activeTableId === table.id;
              
              return (
                <div 
                  key={table.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border-2 ${isActive ? 'bg-blue-50 border-blue-600 shadow-sm' : 'hover:bg-slate-100 border-transparent'}`}
                  onClick={() => setActiveTableId(table.id)}
                >
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={isSelected}
                    onChange={() => toggleTableSelection(table.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FileText className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className={`text-base flex-1 truncate ${isActive ? 'font-semibold text-blue-800' : 'text-slate-700 font-medium'}`}>
                    {tableSettings[table.id]?.displayName || table.name}
                  </span>
                </div>
              );
            })}
            {filteredTables.length === 0 && (
              <div className="text-center text-sm text-slate-500 py-8">
                Không tìm thấy bảng nào
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: CHI TIẾT TRƯỜNG */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeTable ? (
          <>
            <div className="px-6 py-4 border-b border-slate-200 shrink-0 bg-white">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
                    <span>Cấu hình bảng:</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono">{activeTable.name}</span>
                  </h3>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex-1 max-w-md">
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Tên hiển thị bảng:</span>
                    <input 
                      type="text" 
                      placeholder="Nhập tên hiển thị cho bảng..." 
                      value={tableSettings[activeTable.id]?.displayName || ''}
                      onChange={(e) => updateTableSetting(activeTable.id, 'displayName', e.target.value)}
                      className="flex-1 bg-transparent border-0 p-0 text-base focus:outline-none focus:ring-0 text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm trường..." 
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative">
              <table className="w-full min-w-[800px] text-left text-base border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={filteredFields.length > 0 && filteredFields.every(f => selectedFields.has(getFieldKey(activeTable.id, f.id)))}
                        onChange={toggleAllFieldsInActiveTable}
                      />
                    </th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-500 w-48">Tên trường</th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-500 w-32">Kiểu dữ liệu</th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-500 w-24 text-center">Allow null</th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-500 w-24 text-center">Khóa chính</th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-500 min-w-[200px]">Tên hiển thị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFields.map(field => {
                    const fieldKey = getFieldKey(activeTable.id, field.id);
                    const isSelected = selectedFields.has(fieldKey);
                    const settings = fieldSettings[fieldKey] || {};

                    return (
                      <tr key={field.id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-4 py-2.5 text-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleFieldSelection(activeTable.id, field.id)}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input 
                            type="text" 
                            disabled={!isSelected}
                            value={settings.name !== undefined ? settings.name : field.name}
                            onChange={(e) => updateFieldSetting(activeTable.id, field.id, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-base font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input 
                            type="text" 
                            disabled={!isSelected}
                            value={settings.dataType !== undefined ? settings.dataType : field.dataType}
                            onChange={(e) => updateFieldSetting(activeTable.id, field.id, 'dataType', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-base font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <input 
                            type="checkbox" 
                            disabled={!isSelected}
                            checked={settings.allowNull || false}
                            onChange={(e) => updateFieldSetting(activeTable.id, field.id, 'allowNull', e.target.checked)}
                            className="w-4 h-4 rounded text-slate-600 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <input 
                            type="checkbox" 
                            disabled={!isSelected}
                            checked={settings.isPrimaryKey || false}
                            onChange={(e) => updateFieldSetting(activeTable.id, field.id, 'isPrimaryKey', e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input 
                            type="text" 
                            disabled={!isSelected}
                            placeholder="Tên hiển thị thân thiện"
                            value={settings.displayName || ''}
                            onChange={(e) => updateFieldSetting(activeTable.id, field.id, 'displayName', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-base focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {filteredFields.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-sm text-slate-500">
                        Không tìm thấy trường nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Database className="w-12 h-12 mb-3 stroke-[1.5]" />
            <p>Vui lòng chọn một bảng ở danh sách bên trái</p>
          </div>
        )}
      </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
            <Database className="w-8 h-8 text-slate-400 stroke-[1.5]" />
          </div>
          <p className="text-sm text-slate-600">Chưa có dữ liệu cấu trúc. Vui lòng nhấn "Nạp cấu trúc" để lấy thông tin bảng và trường.</p>
          <button
            type="button"
            onClick={() => setIsDataLoaded(true)}
            className="px-6 py-2.5 mt-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Database className="w-4 h-4" />
            Nạp cấu trúc
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
