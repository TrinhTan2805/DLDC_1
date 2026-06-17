import { useState } from 'react';
import { Plus, Download, ChevronRight, ChevronDown, RefreshCw, Save, Trash2, Search, Edit, X, Settings, Users, Database, Shield, FileText, Lock, Home, Folder, Activity, Bell, HelpCircle } from 'lucide-react';
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
  generateSimilarUI?: boolean;
  dataSourceType?: string;
}


const systemIcons = [
  { value: 'Settings', label: 'Settings (Cấu hình)' },
  { value: 'Users', label: 'Users (Người dùng)' },
  { value: 'Database', label: 'Database (Cơ sở dữ liệu)' },
  { value: 'Shield', label: 'Shield (Bảo mật)' },
  { value: 'FileText', label: 'FileText (Nhật ký / Tài liệu)' },
  { value: 'Lock', label: 'Lock (Phân quyền)' },
  { value: 'Home', label: 'Home (Trang chủ)' },
  { value: 'Folder', label: 'Folder (Danh mục)' },
  { value: 'Activity', label: 'Activity (Hoạt động)' },
  { value: 'Bell', label: 'Bell (Thông báo)' },
  { value: 'HelpCircle', label: 'HelpCircle (Trợ giúp)' },
];

const IconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Users,
  Database,
  Shield,
  FileText,
  Lock,
  Home,
  Folder,
  Activity,
  Bell,
  HelpCircle,
};

const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const flattenMenuStructure = (items: any[], parentId: string | null = null): LocalMenuItem[] => {
  let flatList: LocalMenuItem[] = [];
  items.forEach(item => {
    const id = item.id;
    const isDatabaseOrSystemLeaf = 
      id.startsWith('data-info-') ||
      id.startsWith('external-') ||
      (id.startsWith('reconciliation-internal-') && id !== 'reconciliation-internal-ministry') ||
      (id.startsWith('reconciliation-external-') && id !== 'reconciliation-external-ministry') ||
      id.startsWith('processing-data-info-') ||
      id.startsWith('processing-external-') ||
      (id.startsWith('provisioning-shared-') && id !== 'provisioning-shared') ||
      (id.startsWith('provisioning-internal-') && id !== 'provisioning-internal') ||
      id === 'provisioning-open' ||
      id === 'provisioning-master';

    if (isDatabaseOrSystemLeaf) {
      return;
    }

    flatList.push({
      id: item.id,
      name: item.name,
      code: item.id,
      parentId: parentId
    });
    
    // Do not traverse children of "CSDL Trong ngành" and "CSDL Ngoài ngành"
    const nameNormalized = removeVietnameseTones(item.name || '').toLowerCase().trim();
    const shouldSkipChildren = nameNormalized === 'csdl trong nganh' || nameNormalized === 'csdl ngoai nganh';
    
    if (item.children && !shouldSkipChildren) {
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
    generateSimilarUI: false,
    dataSourceType: 'database',
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
    generateSimilarUI: false,
    dataSourceType: 'database',
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
      generateSimilarUI: false,
      dataSourceType: 'database',
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
      generateSimilarUI: false,
      dataSourceType: 'database',
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
          {/* Row 1: Chức năng cha & Đường dẫn tới chức năng & Số thứ tự */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Chức năng cha
              </label>
              <select
                aria-label="Chức năng cha"
                title="Chức năng cha"
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Chọn chức năng cha</option>
                {localMenuItems
                  .filter(item => {
                    const nameNormalized = removeVietnameseTones(item.name || '').toLowerCase().trim();
                    if (nameNormalized === 'csdl trong nganh' || nameNormalized === 'csdl ngoai nganh') {
                      return true;
                    }
                    const excludes = [
                      'csdl',
                      'he thong',
                      'ht quan ly ho so qt',
                      'httt tro giup phap ly',
                      'phan mem tk nganh tu phap',
                      'danh muc',
                      'bhxh va giam ngheo',
                      'nguoi co cong',
                      'tre em',
                      'doi soat tong hop',
                      'doi soat du lieu tu bo',
                      'thu thap so lieu thong ke',
                      'httt cac to chuc hanh nghe cong chung'
                    ];
                    return !excludes.some(term => nameNormalized.includes(term));
                  })
                  .map(item => (
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
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Số thứ tự
              </label>
              <input
                aria-label="Số thứ tự"
                title="Số thứ tự"
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
                aria-label="Tên chức năng"
                title="Tên chức năng"
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
                aria-label="Mã chức năng"
                title="Mã chức năng"
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>



          {/* Row 3: Tính năng liên kết & Chọn icon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tính năng liên kết
              </label>
              <select
                aria-label="Tính năng liên kết"
                title="Tính năng liên kết"
                value={formData.linkedFeature || ''}
                onChange={(e) => setFormData({ ...formData, linkedFeature: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">-- Chọn tính năng liên kết --</option>
                {localMenuItems
                  .filter(item => {
                    const nameNormalized = removeVietnameseTones(item.name || '').toLowerCase().trim();
                    if (nameNormalized === 'csdl trong nganh' || nameNormalized === 'csdl ngoai nganh') {
                      return true;
                    }
                    const excludes = [
                      'csdl',
                      'he thong',
                      'ht quan ly ho so qt',
                      'httt tro giup phap ly',
                      'phan mem tk nganh tu phap',
                      'danh muc',
                      'bhxh va giam ngheo',
                      'nguoi co cong',
                      'tre em',
                      'doi soat tong hop',
                      'doi soat du lieu tu bo',
                      'thu thap so lieu thong ke',
                      'httt cac to chuc hanh nghe cong chung'
                    ];
                    return !excludes.some(term => nameNormalized.includes(term));
                  })
                  .map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Chọn icon
              </label>
              <div className="flex gap-2 items-center">
                <select
                  aria-label="Chọn icon"
                  title="Chọn icon"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">-- Chọn icon --</option>
                  {systemIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                  ))}
                </select>
                {formData.icon && IconComponents[formData.icon] && (
                  <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                    {React.createElement(IconComponents[formData.icon], { className: "w-5 h-5 text-blue-600" })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Trạng thái */}
          <div className="flex gap-8 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-700">
                Trạng thái hoạt động
              </label>
              <button
                aria-label="Chuyển đổi trạng thái"
                title="Chuyển đổi trạng thái"
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
              <span className="text-sm text-slate-600 font-medium">
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Chức năng cha</label>
                  <select
                    aria-label="Chức năng cha"
                    title="Chức năng cha"
                    value={addFormData.parentId || ''}
                    onChange={(e) => handleParentIdChange(e.target.value || null)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">Chọn chức năng cha</option>
                    {localMenuItems
                  .filter(item => {
                    const nameNormalized = removeVietnameseTones(item.name || '').toLowerCase().trim();
                    if (nameNormalized === 'csdl trong nganh' || nameNormalized === 'csdl ngoai nganh') {
                      return true;
                    }
                    const excludes = [
                      'csdl',
                      'he thong',
                      'ht quan ly ho so qt',
                      'httt tro giup phap ly',
                      'phan mem tk nganh tu phap',
                      'danh muc',
                      'bhxh va giam ngheo',
                      'nguoi co cong',
                      'tre em',
                      'doi soat tong hop',
                      'doi soat du lieu tu bo',
                      'thu thap so lieu thong ke',
                      'httt cac to chuc hanh nghe cong chung'
                    ];
                    return !excludes.some(term => nameNormalized.includes(term));
                  })
                  .map(item => (
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
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Số thứ tự</label>
                  <input
                    aria-label="Số thứ tự"
                    title="Số thứ tự"
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
                    aria-label="Tên chức năng"
                    title="Tên chức năng"
                    type="text"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mã chức năng <span className="text-red-600">*</span></label>
                  <input
                    aria-label="Mã chức năng"
                    title="Mã chức năng"
                    type="text"
                    value={addFormData.code}
                    onChange={(e) => setAddFormData({ ...addFormData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Row 3: Tính năng liên kết & Chọn icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tính năng liên kết</label>
                  <select
                    aria-label="Tính năng liên kết"
                    title="Tính năng liên kết"
                    value={addFormData.linkedFeature || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, linkedFeature: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">-- Chọn tính năng liên kết --</option>
                    {localMenuItems
                  .filter(item => {
                    const nameNormalized = removeVietnameseTones(item.name || '').toLowerCase().trim();
                    if (nameNormalized === 'csdl trong nganh' || nameNormalized === 'csdl ngoai nganh') {
                      return true;
                    }
                    const excludes = [
                      'csdl',
                      'he thong',
                      'ht quan ly ho so qt',
                      'httt tro giup phap ly',
                      'phan mem tk nganh tu phap',
                      'danh muc',
                      'bhxh va giam ngheo',
                      'nguoi co cong',
                      'tre em',
                      'doi soat tong hop',
                      'doi soat du lieu tu bo',
                      'thu thap so lieu thong ke',
                      'httt cac to chuc hanh nghe cong chung'
                    ];
                    return !excludes.some(term => nameNormalized.includes(term));
                  })
                  .map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Chọn icon</label>
                  <div className="flex gap-2 items-center">
                    <select
                      aria-label="Chọn icon"
                      title="Chọn icon"
                      value={addFormData.icon || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, icon: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="">-- Chọn icon --</option>
                      {systemIcons.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                    {addFormData.icon && IconComponents[addFormData.icon] && (
                      <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                        {React.createElement(IconComponents[addFormData.icon], { className: "w-5 h-5 text-blue-600" })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 4: Trạng thái */}
              <div className="flex gap-8 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-700">Trạng thái hoạt động</label>
                  <button
                    aria-label="Chuyển đổi trạng thái"
                    title="Chuyển đổi trạng thái"
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
                  <span className="text-sm text-slate-600 font-medium">
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
