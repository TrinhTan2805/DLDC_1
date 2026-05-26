import { useState } from 'react';
import { Plus, Download, ChevronRight, ChevronDown, RefreshCw, Save, Trash2, Search, Edit, X } from 'lucide-react';
import { menuStructure } from './menuStructure';

interface LocalMenuItem {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  enabled: boolean; // Áp dụng cho chức năng này hay không
}

interface FunctionDetail {
  parentId: string | null;
  order: number;
  name: string;
  code: string;
  path: string;
  componentPath: string;
  i18nKey: string;
  type: string;
  active: boolean;
}

const flattenMenuStructure = (items: any[], parentId: string | null = null): LocalMenuItem[] => {
  let flatList: LocalMenuItem[] = [];
  items.forEach(item => {
    flatList.push({
      id: item.id,
      name: item.name,
      code: item.id,
      parentId: parentId
    });
    if (item.children) {
      flatList = flatList.concat(flattenMenuStructure(item.children, item.id));
    }
  });
  return flatList;
};

const menuItems = flattenMenuStructure(menuStructure);

const systemPermissions: Permission[] = [
  { id: 1, name: 'Thêm', code: 'ADD', description: 'Quyền thêm mới dữ liệu', enabled: true },
  { id: 2, name: 'Sửa', code: 'EDIT', description: 'Quyền chỉnh sửa dữ liệu', enabled: true },
  { id: 3, name: 'Xóa', code: 'DELETE', description: 'Quyền xóa dữ liệu', enabled: true },
  { id: 4, name: 'Kết xuất', code: 'EXPORT', description: 'Quyền kết xuất dữ liệu ra file', enabled: true },
  { id: 5, name: 'Trình duyệt', code: 'SUBMIT', description: 'Quyền gửi dữ liệu lên để duyệt', enabled: true },
  { id: 6, name: 'Duyệt', code: 'APPROVE', description: 'Quyền phê duyệt dữ liệu', enabled: true },
  { id: 7, name: 'Khóa', code: 'LOCK', description: 'Quyền khóa/mở khóa dữ liệu', enabled: true },
  { id: 8, name: 'Xem', code: 'VIEW', description: 'Quyền xem chi tiết dữ liệu', enabled: false },
  { id: 9, name: 'Tải lên', code: 'UPLOAD', description: 'Quyền tải file lên', enabled: false },
  { id: 10, name: 'Làm mới', code: 'REFRESH', description: 'Quyền làm mới dữ liệu', enabled: false },
];

type ModalType = 'addPermission' | 'editPermission' | 'addFunction' | null;

export function FunctionManagementPage() {
  const [localMenuItems, setLocalMenuItems] = useState<LocalMenuItem[]>(menuItems);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set([]));
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>(systemPermissions);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [permissionForm, setPermissionForm] = useState({
    name: '',
    code: '',
    description: '',
  });
  
  const [formData, setFormData] = useState<FunctionDetail>({
    parentId: null,
    order: 1,
    name: '',
    code: '',
    path: '',
    componentPath: '',
    i18nKey: '',
    type: 'page',
    active: true,
  });

  const [addFormData, setAddFormData] = useState<FunctionDetail>({
    parentId: null,
    order: 1,
    name: '',
    code: '',
    path: '',
    componentPath: '',
    i18nKey: '',
    type: 'page',
    active: true,
  });

  const toggleMenuExpansion = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const hasChildren = (menuId: string) => {
    return localMenuItems.some(item => item.parentId === menuId);
  };

  const getFilteredMenuItems = () => {
    if (!searchTerm) return localMenuItems;
    return localMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderMenuItem = (item: LocalMenuItem, level: number = 0) => {
    const isExpanded = expandedMenus.has(item.id);
    const isSelected = selectedMenu === item.id;
    const children = localMenuItems.filter(child => child.parentId === item.id);
    const hasChildItems = children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
            isSelected 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-slate-700 hover:bg-slate-50'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            setSelectedMenu(item.id);
            const structureItem = localMenuItems.find(m => m.id === item.id);
            if (structureItem) {
              setFormData({
                ...formData,
                name: structureItem.name,
                code: structureItem.code,
                parentId: structureItem.parentId,
              });
            }
            if (hasChildItems) {
              toggleMenuExpansion(item.id);
            }
          }}
        >
          {hasChildItems && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenuExpansion(item.id);
              }}
              className="text-slate-500"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildItems && <span className="w-4" />}
          <span className="text-sm truncate" title={item.name}>{item.name}</span>
        </div>
        {isExpanded && children.map(child => renderMenuItem(child, level + 1))}
      </div>
    );
  };

  const togglePermission = (permId: number) => {
    setPermissions(permissions.map(p => 
      p.id === permId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleOpenPermissionModal = (type: ModalType, perm?: Permission) => {
    setModalType(type);
    if (perm) {
      setSelectedPermission(perm);
      setPermissionForm({
        name: perm.name,
        code: perm.code,
        description: perm.description,
      });
    } else {
      setSelectedPermission(null);
      setPermissionForm({
        name: '',
        code: '',
        description: '',
      });
    }
  };

  const handleClosePermissionModal = () => {
    setModalType(null);
    setSelectedPermission(null);
  };

  const handleSavePermission = () => {
    if (modalType === 'addPermission') {
      const newPermission: Permission = {
        id: Math.max(...permissions.map(p => p.id)) + 1,
        ...permissionForm,
        enabled: false,
      };
      setPermissions([...permissions, newPermission]);
    } else if (modalType === 'editPermission' && selectedPermission) {
      setPermissions(permissions.map(p => 
        p.id === selectedPermission.id 
          ? { ...p, ...permissionForm }
          : p
      ));
    }
    handleClosePermissionModal();
  };

  const handleDeletePermission = (permId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa quyền này?')) {
      setPermissions(permissions.filter(p => p.id !== permId));
    }
  };

  const handleSave = () => {
    const enabledPermissions = permissions.filter(p => p.enabled);
    console.log('Saving function:', formData);
    console.log('With permissions:', enabledPermissions);
    alert(`Đã lưu chức năng "${formData.name}" với ${enabledPermissions.length} quyền được áp dụng`);
  };

  const handleRefresh = () => {
    setFormData({
      parentId: null,
      order: 0,
      name: '',
      code: '',
      path: '',
      componentPath: '',
      i18nKey: '',
      type: '',
      active: true,
    });
    setPermissions(permissions.map(p => ({ ...p, enabled: false })));
  };

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa chức năng này?')) {
      console.log('Deleting');
    }
  };

  const handleOpenAddFunction = () => {
    setModalType('addFunction');
    setAddFormData({
      ...addFormData,
      parentId: null,
      order: 1,
      name: '',
      code: '',
      path: '',
      componentPath: '',
      i18nKey: '',
      type: 'page',
      active: true,
    });
  };

  const handleParentIdChange = (parentId: string | null) => {
    if (!parentId) {
      setAddFormData({ ...addFormData, parentId, order: 1 });
      return;
    }
    const childrenCount = localMenuItems.filter(i => i.parentId === parentId).length;
    let order = childrenCount + 1;
    if (order === 1) order = 2; // satisfy "nếu đã có chức năng cha thì ô số thứ tự không được là 1"
    setAddFormData({ ...addFormData, parentId, order });
  };

  const handleAddFunctionSave = () => {
    if (!addFormData.name || !addFormData.code) {
      return alert('Vui lòng nhập tên và mã chức năng');
    }
    if (addFormData.parentId && addFormData.order === 1) {
      return alert('Nếu đã có chức năng cha thì số thứ tự không được là 1');
    }

    const newItem: LocalMenuItem = {
      id: addFormData.code,
      name: addFormData.name,
      code: addFormData.code,
      parentId: addFormData.parentId,
    };
    
    setLocalMenuItems([...localMenuItems, newItem]);
    if (addFormData.parentId) {
      setExpandedMenus(new Set(expandedMenus).add(addFormData.parentId));
    }
    setModalType(null);
    alert('Thêm mới chức năng thành công!');
  };

  return (
    <div className="flex h-full gap-6 function-management-page">
      <style>{`
        .function-management-page :not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(h1 *):not(h2 *):not(h3 *):not(h4 *):not(h5 *):not(h6 *) {
          font-size: 13px !important;
        }
      `}</style>
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg border border-slate-200 p-4 flex flex-col gap-4 h-fit">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm menu..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleOpenAddFunction}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>

        {/* Menu Tree */}
        <div className="space-y-1">
          {getFilteredMenuItems()
            .filter(item => item.parentId === null)
            .map(item => renderMenuItem(item))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200 p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Cập nhật chức năng: <span className="text-blue-600">{formData.name}</span>
        </h2>

        <div className="mt-6 space-y-5">
          {/* Row 1: Chức năng cha & Số thứ tự */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Chức năng cha
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Chọn chức năng cha</option>
                {localMenuItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Số thứ tự
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Row 2: Tên chức năng & Mã chức năng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên chức năng <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Mã chức năng
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>



          {/* Row 4: Đường dẫn (Path) */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Đường dẫn (Path)
            </label>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              placeholder="/quan-ly-danh-muc/toan-van-ban"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Row 5: Component Path */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Component Path
            </label>
            <input
              type="text"
              value={formData.componentPath}
              onChange={(e) => setFormData({ ...formData, componentPath: e.target.value })}
              placeholder="/components/DanhMucLoaiVanBan"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Row 6: Dịch khóa (i18n key) */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Dịch khóa (i18n key)
            </label>
            <input
              type="text"
              value={formData.i18nKey}
              onChange={(e) => setFormData({ ...formData, i18nKey: e.target.value })}
              placeholder="menu.category.document"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Row 7: Loại */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Loại
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Chọn loại</option>
              <option value="menu">Menu</option>
              <option value="page">Page</option>
              <option value="function">Function</option>
            </select>
          </div>

          {/* Conditional Cấu hình nâng cao (Page/Menu) */}
          {(formData.type === 'page' || formData.type === 'menu') && (
            <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">
                  Lấy theo mẫu màn hình
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">-- Chọn màn hình mẫu --</option>
                  <option value="template-1">Mẫu Quản lý Danh mục chuẩn</option>
                  <option value="template-2">Mẫu Báo cáo Thống kê</option>
                  <option value="template-3">Mẫu Xử lý Nghiệp vụ</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Lấy cấu trúc từ màn hình tương tự cùng phân hệ</p>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">
                  Bảng dữ liệu (CSDL)
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">-- Chọn bảng dữ liệu --</option>
                  <option value="tbl_danh_muc_loai_van_ban">tbl_danh_muc_loai_van_ban</option>
                  <option value="tbl_ho_so_nghiep_vu">tbl_ho_so_nghiep_vu</option>
                  <option value="tbl_can_bo_nhan_vien">tbl_can_bo_nhan_vien</option>
                  <option value="raw">-- Tự định nghĩa (Raw Data) --</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Nạp cấu trúc cột từ bảng dữ liệu có sẵn</p>
              </div>
            </div>
          )}

          {/* Row 8: Toggles */}
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-700">
                Trạng thái
              </label>
              <button
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600">
                {formData.active ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>

          {/* Row 9: Danh sách quyền trong hệ thống */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Quyền thao tác trên màn hình
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Tick chọn các quyền áp dụng cho chức năng này. Mục đích: để phân quyền cho người dùng/nhóm người dùng
                </p>
              </div>
              <button
                onClick={() => handleOpenPermissionModal('addPermission')}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm quyền
              </button>
            </div>

            {/* Permissions Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 w-12">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">TÊN QUYỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">MÃ QUYỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">MÔ TẢ</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 w-24">ÁP DỤNG</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 w-24">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, index) => (
                    <tr key={perm.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{perm.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <code className="px-2 py-1 bg-slate-100 rounded text-xs">{perm.code}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{perm.description}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.enabled}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenPermissionModal('editPermission', perm)}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePermission(perm.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>{permissions.filter(p => p.enabled).length}</strong> quyền được áp dụng cho chức năng này
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Lưu
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>

      {/* Add/Edit Permission Modal */}
      {(modalType === 'addPermission' || modalType === 'editPermission') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {modalType === 'addPermission' ? 'Thêm quyền mới' : 'Chỉnh sửa quyền'}
              </h3>
              <button 
                onClick={handleClosePermissionModal} 
                className="text-slate-400 hover:text-slate-600 transition-colors" title="Đóng" aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tên quyền <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={permissionForm.name}
                    onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
                    placeholder="VD: Thêm"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mã quyền <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={permissionForm.code}
                    onChange={(e) => setPermissionForm({ ...permissionForm, code: e.target.value.toUpperCase() })}
                    placeholder="VD: ADD"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={permissionForm.description}
                    onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                    placeholder="VD: Quyền thêm mới dữ liệu"
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={handleClosePermissionModal}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSavePermission}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {modalType === 'addPermission' ? 'Thêm mới' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Function Modal */}
      {modalType === 'addFunction' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-900">Thêm mới chức năng</h3>
              <button 
                onClick={() => setModalType(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors" title="Đóng" aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Chức năng cha</label>
                  <select
                    value={addFormData.parentId || ''}
                    onChange={(e) => handleParentIdChange(e.target.value || null)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Chọn chức năng cha</option>
                    {localMenuItems.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Số thứ tự</label>
                  <input
                    type="number"
                    value={addFormData.order}
                    onChange={(e) => setAddFormData({ ...addFormData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    min={addFormData.parentId ? 2 : 1}
                  />
                  {addFormData.parentId && addFormData.order === 1 && (
                    <p className="text-red-500 text-xs mt-1">Không được là 1 khi đã có chức năng cha</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên chức năng <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mã chức năng <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={addFormData.code}
                    onChange={(e) => setAddFormData({ ...addFormData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Đường dẫn (Path)</label>
                <input
                  type="text"
                  value={addFormData.path}
                  onChange={(e) => setAddFormData({ ...addFormData, path: e.target.value })}
                  placeholder="/quan-ly-danh-muc/toan-van-ban"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Component Path</label>
                <input
                  type="text"
                  value={addFormData.componentPath}
                  onChange={(e) => setAddFormData({ ...addFormData, componentPath: e.target.value })}
                  placeholder="/components/DanhMucLoaiVanBan"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Dịch khóa (i18n key)</label>
                <input
                  type="text"
                  value={addFormData.i18nKey}
                  onChange={(e) => setAddFormData({ ...addFormData, i18nKey: e.target.value })}
                  placeholder="menu.category.document"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Loại</label>
                <select
                  value={addFormData.type}
                  onChange={(e) => setAddFormData({ ...addFormData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Chọn loại</option>
                  <option value="menu">Menu</option>
                  <option value="page">Page</option>
                  <option value="function">Function</option>
                </select>
              </div>

              {/* Conditional Cấu hình nâng cao (Page/Menu) */}
              {(addFormData.type === 'page' || addFormData.type === 'menu') && (
                <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2 font-medium">Lấy theo mẫu màn hình</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                      <option value="">-- Chọn màn hình mẫu --</option>
                      <option value="template-1">Mẫu Quản lý Danh mục chuẩn</option>
                      <option value="template-2">Mẫu Báo cáo Thống kê</option>
                      <option value="template-3">Mẫu Xử lý Nghiệp vụ</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Lấy cấu trúc từ màn hình tương tự cùng phân hệ</p>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2 font-medium">Bảng dữ liệu (CSDL)</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                      <option value="">-- Chọn bảng dữ liệu --</option>
                      <option value="tbl_danh_muc_loai_van_ban">tbl_danh_muc_loai_van_ban</option>
                      <option value="tbl_ho_so_nghiep_vu">tbl_ho_so_nghiep_vu</option>
                      <option value="tbl_can_bo_nhan_vien">tbl_can_bo_nhan_vien</option>
                      <option value="raw">-- Tự định nghĩa (Raw Data) --</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Nạp cấu trúc cột từ bảng dữ liệu có sẵn</p>
                  </div>
                </div>
              )}

              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-700">Trạng thái</label>
                  <button
                    onClick={() => setAddFormData({ ...addFormData, active: !addFormData.active })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      addFormData.active ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        addFormData.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-slate-600">
                    {addFormData.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddFunctionSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu chức năng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
