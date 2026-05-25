import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { syncFunctions, getModules, FunctionItem } from '../../../utils/functionSync';

export function FunctionListPage() {
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [filterModule, setFilterModule] = useState('');
  const [filterGroupCode, setFilterGroupCode] = useState('');
  const [filterGroupName, setFilterGroupName] = useState('');
  const [filterUserGroup, setFilterUserGroup] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-sync on mount
  useEffect(() => {
    handleSync();
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate sync delay
    setTimeout(() => {
      const syncedFunctions = syncFunctions();
      setFunctions(syncedFunctions);
      setIsSyncing(false);
    }, 800);
  };

  const modules = getModules();
  const userGroups = [
    'Quản trị hệ thống', 
    'Lãnh đạo Bộ phận quản trị', 
    'Cán bộ nghiệp vụ Hộ tịch điện tử', 
    'Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch', 
    'Cán bộ nghiệp vụ thi hành án dân sự', 
    'Cán bộ nghiệp vụ CSDL quốc gia về pháp luật', 
    'Lãnh đạo nghiệp vụ Hộ tịch điện tử', 
    'Lãnh đạo nghiệp vụ quản lý hồ sơ quốc tịch'
  ];

  // Filter functions
  const filteredFunctions = functions.filter(func => {
    const matchesModule = !filterModule || func.module === filterModule;
    const matchesGroupCode = !filterGroupCode || func.code.toLowerCase().includes(filterGroupCode.toLowerCase());
    const matchesGroupName = !filterGroupName || func.name.toLowerCase().includes(filterGroupName.toLowerCase());
    return matchesModule && matchesGroupCode && matchesGroupName;
  });

  const togglePermission = (functionId: string, permissionKey: keyof FunctionItem['permissions']) => {
    setFunctions(functions.map(func => {
      // Only toggle if permission is available for this function
      if (func.id === functionId && func.availablePermissions[permissionKey]) {
        return {
          ...func,
          permissions: {
            ...func.permissions,
            [permissionKey]: !func.permissions[permissionKey]
          }
        };
      }
      return func;
    }));
  };

  // Toggle all permissions for a specific column
  const toggleAllPermissions = (permissionKey: keyof FunctionItem['permissions']) => {
    // Only consider functions where this permission is available
    const availableFunctions = filteredFunctions.filter(func => func.availablePermissions[permissionKey]);
    const allChecked = availableFunctions.every(func => func.permissions[permissionKey]);
    
    setFunctions(functions.map(func => {
      // Only toggle if permission is available for this function
      if (func.availablePermissions[permissionKey]) {
        return {
          ...func,
          permissions: {
            ...func.permissions,
            [permissionKey]: !allChecked
          }
        };
      }
      return func;
    }));
  };

  // Check if all permissions in a column are checked (only counting available ones)
  const isAllChecked = (permissionKey: keyof FunctionItem['permissions']) => {
    const availableFunctions = filteredFunctions.filter(func => func.availablePermissions[permissionKey]);
    return availableFunctions.length > 0 && availableFunctions.every(func => func.permissions[permissionKey]);
  };

  // Check if some (but not all) permissions in a column are checked (only counting available ones)
  const isSomeChecked = (permissionKey: keyof FunctionItem['permissions']) => {
    const availableFunctions = filteredFunctions.filter(func => func.availablePermissions[permissionKey]);
    const checkedCount = availableFunctions.filter(func => func.permissions[permissionKey]).length;
    return checkedCount > 0 && checkedCount < availableFunctions.length;
  };

  const getIndentClass = (level: number) => {
    if (level === 0) return '';
    if (level === 1) return 'pl-6';
    if (level === 2) return 'pl-12';
    return 'pl-16';
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Phần mềm */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Phần mềm</label>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              {modules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>

          {/* Mã nhóm quyền */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Mã nhóm quyền</label>
            <input
              type="text"
              value={filterGroupCode}
              onChange={(e) => setFilterGroupCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mã..."
            />
          </div>

          {/* Tên nhóm quyền */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Tên nhóm quyền</label>
            <input
              type="text"
              value={filterGroupName}
              onChange={(e) => setFilterGroupName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên..."
            />
          </div>

          {/* Nhóm người dùng */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Nhóm người dùng</label>
            <div className="relative">
              <select
                value={filterUserGroup}
                onChange={(e) => setFilterUserGroup(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
              >
                <option value="">Chọn nhóm...</option>
                {userGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              {filterUserGroup && (
                <button
                  onClick={() => setFilterUserGroup('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Nút đồng bộ */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">&nbsp;</label>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ chức năng'}
            </button>
          </div>
        </div>
      </div>

      {/* Function list table with permissions matrix */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200 sticky left-0 bg-slate-50 z-10">
                  STT
                </th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200 min-w-[300px] sticky left-[60px] bg-slate-50 z-10">
                  Chức năng
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Xem</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('view')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('view');
                      }}
                      onChange={() => toggleAllPermissions('view')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Thêm</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('add')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('add');
                      }}
                      onChange={() => toggleAllPermissions('add')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Sửa</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('edit')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('edit');
                      }}
                      onChange={() => toggleAllPermissions('edit')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Xóa</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('delete')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('delete');
                      }}
                      onChange={() => toggleAllPermissions('delete')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[90px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Tra cứu</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('search')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('search');
                      }}
                      onChange={() => toggleAllPermissions('search')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Kết xuất</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('export')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('export');
                      }}
                      onChange={() => toggleAllPermissions('export')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">In</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('print')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('print');
                      }}
                      onChange={() => toggleAllPermissions('print')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Tải lên (Import)</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('import')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('import');
                      }}
                      onChange={() => toggleAllPermissions('import')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[110px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Trình duyệt</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('submit')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('submit');
                      }}
                      onChange={() => toggleAllPermissions('submit')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Duyệt</span>
                    <input
                      type="checkbox"
                      checked={isAllChecked('approve')}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeChecked('approve');
                      }}
                      onChange={() => toggleAllPermissions('approve')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFunctions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-slate-500 text-sm">
                    {isSyncing ? 'Đang đồng bộ chức năng...' : 'Không có chức năng nào. Nhấn "Đồng bộ chức năng" để tải danh sách.'}
                  </td>
                </tr>
              ) : (
                filteredFunctions.map((func, index) => (
                  <tr key={func.id} className={`hover:bg-slate-50 ${func.level === 0 ? 'bg-blue-50/30' : func.level === 1 ? 'bg-slate-50/50' : ''}`}>
                    <td className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100 sticky left-0 bg-white">
                      {index + 1}
                    </td>
                    <td className={`px-4 py-3 text-sm text-slate-900 border-r border-slate-100 sticky left-[60px] bg-white ${getIndentClass(func.level)}`}>
                      <div className="flex items-center gap-2">
                        {func.level > 0 && (
                          <span className="text-slate-400">
                            {func.level === 1 ? '└─' : '　└─'}
                          </span>
                        )}
                        <span className={func.level === 0 ? 'font-medium' : ''}>{func.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.view}
                        onChange={() => togglePermission(func.id, 'view')}
                        disabled={!func.availablePermissions.view}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.add}
                        onChange={() => togglePermission(func.id, 'add')}
                        disabled={!func.availablePermissions.add}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.edit}
                        onChange={() => togglePermission(func.id, 'edit')}
                        disabled={!func.availablePermissions.edit}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.delete}
                        onChange={() => togglePermission(func.id, 'delete')}
                        disabled={!func.availablePermissions.delete}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.search}
                        onChange={() => togglePermission(func.id, 'search')}
                        disabled={!func.availablePermissions.search}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.export}
                        onChange={() => togglePermission(func.id, 'export')}
                        disabled={!func.availablePermissions.export}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.print}
                        onChange={() => togglePermission(func.id, 'print')}
                        disabled={!func.availablePermissions.print}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.import}
                        onChange={() => togglePermission(func.id, 'import')}
                        disabled={!func.availablePermissions.import}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={func.permissions.submit}
                        onChange={() => togglePermission(func.id, 'submit')}
                        disabled={!func.availablePermissions.submit}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={func.permissions.approve}
                        onChange={() => togglePermission(func.id, 'approve')}
                        disabled={!func.availablePermissions.approve}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredFunctions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="text-blue-900">
              <span className="font-medium">Tổng số chức năng:</span>{' '}
              <span className="text-blue-700">{filteredFunctions.length}</span>
            </div>
            <div className="text-blue-900">
              <span className="font-medium">Chức năng cha:</span>{' '}
              <span className="text-blue-700">{filteredFunctions.filter(f => f.level === 0).length}</span>
            </div>
            <div className="text-blue-900">
              <span className="font-medium">Chức năng con:</span>{' '}
              <span className="text-blue-700">{filteredFunctions.filter(f => f.level > 0).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
