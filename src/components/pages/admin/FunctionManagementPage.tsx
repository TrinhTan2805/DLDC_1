import { useState } from 'react';
import { Plus, ChevronRight, ChevronDown, Save, Trash2, Search, X, Settings, Users, Database, Shield, FileText, Lock, Home, Folder, Activity, Bell, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { menuStructure } from './menuStructure';
import { ConfirmModal } from '../../common/ConfirmModal';
import { TruncatedText, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, BTN_FOCUS, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, SECTION_TITLE, normalizeSearch } from '../collection/collectionUi';

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
  linkedFeature?: string;
  icon?: string;
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
    .replace(/[̀-ͯ]/g, '')
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

// Công tắc Bật/Tắt (mục 5.12): bật blue-600, tắt #CBD5E1
const switchClass = (on: boolean) =>
  `relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${BTN_FOCUS} ${on ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`;
const switchKnobClass = (on: boolean) =>
  `pointer-events-none block h-4 w-4 rounded-full bg-white transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`;

// Ô xem trước icon đã chọn (cao 40px như ô nhập)
const ICON_PREVIEW_CLS = 'w-10 h-10 shrink-0 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center';

export function FunctionManagementPage() {
  const [localMenuItems, setLocalMenuItems] = useState<LocalMenuItem[]>(menuItems);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set([]));
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  // Tìm kiếm chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    if (!appliedSearch) return localMenuItems;
    return localMenuItems.filter(item =>
      normalizeSearch(item.name).includes(normalizeSearch(appliedSearch))
    );
  };

  const runSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const renderMenuItem = (item: LocalMenuItem, level: number = 0) => {
    const isExpanded = expandedMenus.has(item.id);
    const isSelected = selectedMenu === item.id;
    const children = localMenuItems.filter(child => child.parentId === item.id);
    const hasChildItems = children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 h-9 pr-3 cursor-pointer rounded-lg text-[13px] transition-colors ${
            isSelected
              ? 'bg-[#EAF3FF] text-blue-600 font-medium'
              : 'text-[#020817] hover:bg-[#F8FAFC]'
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
              type="button"
              aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenuExpansion(item.id);
              }}
              className={`shrink-0 rounded text-[#475569] hover:text-blue-600 ${BTN_FOCUS}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildItems && <span className="w-4 shrink-0" />}
          <span className="min-w-0 flex-1">
            <TruncatedText text={item.name} />
          </span>
        </div>
        {isExpanded && children.map(child => renderMenuItem(child, level + 1))}
      </div>
    );
  };

  const handleSave = () => {
    console.log('Saving function:', formData);
    toast.success(`Đã lưu chức năng "${formData.name}" thành công!`);
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

  // Xác nhận xóa bằng hộp thoại chuẩn (thay window.confirm — mục 5.4)
  const handleDelete = () => {
    setShowDeleteConfirm(true);
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
      toast.error('Vui lòng nhập tên và mã chức năng');
      return;
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
    toast.success('Thêm mới chức năng thành công!');
  };

  const SelectedIcon = formData.icon ? IconComponents[formData.icon] : undefined;
  const AddSelectedIcon = addFormData.icon ? IconComponents[addFormData.icon] : undefined;
  const addOrderInvalid = !!addFormData.parentId && addFormData.order === 1;

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar */}
      <div className="w-72 shrink-0 bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col gap-4 h-fit">
        {/* Search */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm menu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            placeholder="Tìm kiếm menu..."
            className={SEARCH_INPUT_CLS}
          />
          <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleOpenAddFunction}
            className={`${BTN_PRIMARY} flex-1`}
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>

        {/* Menu Tree */}
        <div className="space-y-0.5">
          {getFilteredMenuItems()
            .filter(item => item.parentId === null)
            .map(item => renderMenuItem(item))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#E2E8F0] p-6 overflow-y-auto custom-scrollbar">
        <h2 className={SECTION_TITLE}>
          <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
          <span className="min-w-0">
            Cập nhật chức năng: <span className="text-blue-600">{formData.name}</span>
          </span>
        </h2>

        <div className="space-y-4">
          {/* Row 1: Chức năng cha & Đường dẫn tới chức năng & Số thứ tự */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={LABEL_CLS}>
                Chức năng cha
              </label>
              <select
                aria-label="Chức năng cha"
                title="Chức năng cha"
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                className={INPUT_CLS}
              >
                <option value="" disabled hidden>-- Chọn chức năng cha --</option>
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
              <label className={LABEL_CLS}>
                Đường dẫn tới chức năng
              </label>
              <select
                aria-label="Đường dẫn tới chức năng"
                value={formData.path || ''}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                className={INPUT_CLS}
              >
                <option value="" disabled hidden>-- Chọn chức năng --</option>
                {localMenuItems.map(item => (
                  <option key={item.id} value={`/admin/${item.code}`}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>
                Số thứ tự
              </label>
              <input
                aria-label="Số thứ tự"
                title="Số thứ tự"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Row 2: Tên chức năng & Mã chức năng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>
                Tên chức năng <span className={REQUIRED_MARK}>*</span>
              </label>
              <input
                aria-label="Tên chức năng"
                title="Tên chức năng"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>
                Mã chức năng
              </label>
              <input
                aria-label="Mã chức năng"
                title="Mã chức năng"
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Row 3: Tính năng liên kết & Chọn icon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>
                Tính năng liên kết
              </label>
              <select
                aria-label="Tính năng liên kết"
                title="Tính năng liên kết"
                value={formData.linkedFeature || ''}
                onChange={(e) => setFormData({ ...formData, linkedFeature: e.target.value })}
                className={INPUT_CLS}
              >
                <option value="" disabled hidden>-- Chọn tính năng liên kết --</option>
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
              <label className={LABEL_CLS}>
                Chọn icon
              </label>
              <div className="flex gap-2 items-center">
                <select
                  aria-label="Chọn icon"
                  title="Chọn icon"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className={`${INPUT_CLS} flex-1`}
                >
                  <option value="" disabled hidden>-- Chọn icon --</option>
                  {systemIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                  ))}
                </select>
                {SelectedIcon && (
                  <div className={ICON_PREVIEW_CLS}>
                    <SelectedIcon className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Trạng thái */}
          <div className="flex gap-8 border-t border-[#E2E8F0] pt-4">
            <div className="flex items-center gap-3">
              <label className="text-[13px] font-semibold text-[#020817]">
                Trạng thái hoạt động
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={formData.active}
                aria-label="Chuyển đổi trạng thái"
                title="Chuyển đổi trạng thái"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={switchClass(formData.active)}
              >
                <span className={switchKnobClass(formData.active)} />
              </button>
              <span className="text-[13px] text-[#020817]">
                {formData.active ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={handleSave}
            className={BTN_PRIMARY}
          >
            <Save className="w-4 h-4" />
            Lưu
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={BTN_DESTRUCTIVE}
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>


      {/* Add Function Modal */}
      {modalType === 'addFunction' && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="add-function-modal-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="add-function-modal-title" className="text-[16px] font-semibold text-[#020817]">Thêm mới chức năng</h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLS}>Chức năng cha</label>
                  <select
                    aria-label="Chức năng cha"
                    title="Chức năng cha"
                    value={addFormData.parentId || ''}
                    onChange={(e) => handleParentIdChange(e.target.value || null)}
                    className={INPUT_CLS}
                  >
                    <option value="" disabled hidden>-- Chọn chức năng cha --</option>
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
                  <label className={LABEL_CLS}>Đường dẫn tới chức năng</label>
                  <select
                    aria-label="Đường dẫn tới chức năng"
                    value={addFormData.path || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, path: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="" disabled hidden>-- Chọn chức năng --</option>
                    {localMenuItems.map(item => (
                      <option key={item.id} value={`/admin/${item.code}`}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Số thứ tự</label>
                  <input
                    aria-label="Số thứ tự"
                    title="Số thứ tự"
                    type="number"
                    value={addFormData.order}
                    onChange={(e) => setAddFormData({ ...addFormData, order: Number(e.target.value) })}
                    className={`${INPUT_CLS} ${addOrderInvalid ? '!border-[#DC2626]' : ''}`}
                    min={addFormData.parentId ? 2 : 1}
                  />
                  {addOrderInvalid && (
                    <p className="mt-1 text-[12px] text-[#DC2626]">Không được là 1 khi đã có chức năng cha</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tên chức năng <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    aria-label="Tên chức năng"
                    title="Tên chức năng"
                    type="text"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Mã chức năng <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    aria-label="Mã chức năng"
                    title="Mã chức năng"
                    type="text"
                    value={addFormData.code}
                    onChange={(e) => setAddFormData({ ...addFormData, code: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              {/* Row 3: Tính năng liên kết & Chọn icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tính năng liên kết</label>
                  <select
                    aria-label="Tính năng liên kết"
                    title="Tính năng liên kết"
                    value={addFormData.linkedFeature || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, linkedFeature: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="" disabled hidden>-- Chọn tính năng liên kết --</option>
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
                  <label className={LABEL_CLS}>Chọn icon</label>
                  <div className="flex gap-2 items-center">
                    <select
                      aria-label="Chọn icon"
                      title="Chọn icon"
                      value={addFormData.icon || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, icon: e.target.value })}
                      className={`${INPUT_CLS} flex-1`}
                    >
                      <option value="" disabled hidden>-- Chọn icon --</option>
                      {systemIcons.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                    {AddSelectedIcon && (
                      <div className={ICON_PREVIEW_CLS}>
                        <AddSelectedIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 4: Trạng thái */}
              <div className="flex gap-8 border-t border-[#E2E8F0] pt-4">
                <div className="flex items-center gap-3">
                  <label className="text-[13px] font-semibold text-[#020817]">Trạng thái hoạt động</label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={addFormData.active}
                    aria-label="Chuyển đổi trạng thái"
                    title="Chuyển đổi trạng thái"
                    onClick={() => setAddFormData({ ...addFormData, active: !addFormData.active })}
                    className={switchClass(addFormData.active)}
                  >
                    <span className={switchKnobClass(addFormData.active)} />
                  </button>
                  <span className="text-[13px] text-[#020817]">
                    {addFormData.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddFunctionSave}
                className={BTN_PRIMARY}
              >
                Lưu chức năng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận xóa (thay window.confirm bằng hộp thoại chuẩn 5.4) */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          console.log('Deleting');
        }}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa chức năng này?"
      />
    </div>
  );
}
