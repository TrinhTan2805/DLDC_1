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

// Filter menu structure to remove CSDL/Hệ thống nodes as per user request
const filterMenuStructure = (items: any[]): any[] => {
  const dynamicParentIds = [
    'view-data-internal',
    'view-data-external',
    'reconciliation-external-ministry',
    'reconciliation-internal-ministry',
    'processing-internal',
    'processing-external',
    'provisioning-shared',
    'provisioning-internal',
    'reconciliation-catalog'
  ];

  return items
    .map(item => {
      if (dynamicParentIds.includes(item.id)) {
        return {
          ...item,
          children: undefined
        };
      }
      
      if (item.children) {
        const filteredChildren = filterMenuStructure(item.children);
        return {
          ...item,
          children: filteredChildren
        };
      }
      
      return item;
    });
};

const filteredMenuStructure = filterMenuStructure(menuStructure);
const menuItems = flattenMenuStructure(filteredMenuStructure);

type ModalType = 'addFunction' | null;

export function FunctionManagementPage() {
  const [localMenuItems, setLocalMenuItems] = useState<LocalMenuItem[]>(menuItems);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set([]));
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);
  
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

  const handleSave = () => {
    console.log('Saving function:', formData);
    alert(`Đã lưu chức năng "${formData.name}" thành công!`);
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
    setAddFormData({ ...addFormData, parentId });
  };

  const handleAddFunctionSave = () => {
    if (!addFormData.name || !addFormData.code) {
      return alert('Vui lòng nhập tên và mã chức năng');
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
          {/* Row 1: Chức năng cha & Đường dẫn tới chức năng */}
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
                Đường dẫn tới chức năng
              </label>
              <select
                value={formData.path || ''}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Chọn chức năng</option>
                {localMenuItems.map(item => (
                  <option key={item.id} value={`/admin/${item.code}`}>{item.name}</option>
                ))}
              </select>
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
                  <label className="block text-sm text-slate-700 mb-2">Đường dẫn tới chức năng</label>
                  <select
                    value={addFormData.path || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, path: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">Chọn chức năng</option>
                    {localMenuItems.map(item => (
                      <option key={item.id} value={`/admin/${item.code}`}>{item.name}</option>
                    ))}
                  </select>
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
