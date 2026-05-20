import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, Eye, UserPlus, Lock, Settings, ChevronRight, ChevronDown, X } from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';
import { UsersRound } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  code: string;
  description: string;
  department: string;
  memberCount: number;
  functionCount: number;
  createdDate: string;
  status: 'active' | 'inactive';
  members: Member[];
  functions: string[];
  functionPermissions?: { [functionId: string]: string[] };
  dataPermissions?: { [sourceId: string]: string[] };
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface MenuFunction {
  id: string;
  name: string;
  actions: string[];
}

interface MenuItem {
  id: string;
  name: string;
  children?: MenuItem[];
  functions?: MenuFunction[];
}

const menuStructure: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Tổng quan',
    functions: [
      { id: 'dashboard-main', name: 'Dashboard', actions: ['Xem', 'Xuất Excel'] }
    ]
  },
  {
    id: 'data-collection',
    name: 'Quản lý thu thập CSDL',
    children: [
      {
        id: 'legal-docs',
        name: 'CSDL Văn bản QPPL',
        functions: [
          { id: 'legal-docs-list', name: 'Danh sách văn bản', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel', 'Import Excel'] }
        ]
      },
      {
        id: 'business-reg',
        name: 'CSDL Đăng ký kinh doanh',
        functions: [
          { id: 'business-reg-list', name: 'Danh sách đăng ký', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel', 'Import Excel'] }
        ]
      },
      {
        id: 'notary',
        name: 'CSDL Công chứng',
        functions: [
          { id: 'notary-list', name: 'Danh sách công chứng', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel', 'Import Excel'] }
        ]
      },
      {
        id: 'legal-aid',
        name: 'CSDL TGPL',
        functions: [
          { id: 'legal-aid-list', name: 'Danh sách TGPL', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel', 'Import Excel'] }
        ]
      }
    ]
  },
  {
    id: 'data-processing',
    name: 'Xử lý dữ liệu',
    children: [
      {
        id: 'internal-data',
        name: 'Dữ liệu trong ngành',
        functions: [
          { id: 'internal-list', name: 'Danh sách dữ liệu', actions: ['Xem', 'Cấu hình xử lý', 'Sửa lỗi', 'Xuất Excel'] },
          { id: 'internal-config', name: 'Cấu hình xử lý dữ liệu', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa'] },
          { id: 'internal-warnings', name: 'Danh sách dữ liệu cảnh báo', actions: ['Xem', 'Sửa', 'Xuất Excel'] },
          { id: 'internal-history', name: 'Lịch sử xử lý', actions: ['Xem', 'Xuất Excel'] }
        ]
      },
      {
        id: 'external-data',
        name: 'Dữ liệu ngoài ngành',
        functions: [
          { id: 'external-list', name: 'Danh sách dữ liệu', actions: ['Xem', 'Cấu hình xử lý', 'Sửa lỗi', 'Xuất Excel'] },
          { id: 'external-config', name: 'Cấu hình xử lý dữ liệu', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa'] },
          { id: 'external-warnings', name: 'Danh sách dữ liệu cảnh báo', actions: ['Xem', 'Sửa', 'Xuất Excel'] },
          { id: 'external-history', name: 'Lịch sử xử lý', actions: ['Xem', 'Xuất Excel'] }
        ]
      }
    ]
  },
  {
    id: 'master-data',
    name: 'Quản lý danh mục',
    children: [
      {
        id: 'categories',
        name: 'Danh mục dữ liệu',
        functions: [
          { id: 'category-list', name: 'Danh sách danh mục', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel', 'Import Excel'] }
        ]
      },
      {
        id: 'sources',
        name: 'Nguồn dữ liệu',
        functions: [
          { id: 'source-list', name: 'Danh sách nguồn', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa'] }
        ]
      }
    ]
  },
  {
    id: 'admin',
    name: 'Quản lý hệ thống',
    children: [
      {
        id: 'users',
        name: 'Quản lý người dùng',
        functions: [
          { id: 'user-list', name: 'Danh sách người dùng', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Khóa/Mở khóa', 'Xuất Excel'] }
        ]
      },
      {
        id: 'groups',
        name: 'Quản lý nhóm',
        functions: [
          { id: 'group-list', name: 'Danh sách nhóm', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Phân quyền'] }
        ]
      },
      {
        id: 'roles',
        name: 'Quản lý vai trò',
        functions: [
          { id: 'role-list', name: 'Danh sách vai trò', actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Phân quyền'] }
        ]
      }
    ]
  }
];

const dataSources = [
  { id: 'vbqppl', name: 'CSDL Văn bản QPPL' },
  { id: 'dkkd', name: 'CSDL Đăng ký kinh doanh' },
  { id: 'cc', name: 'CSDL Công chứng' },
  { id: 'tgpl', name: 'CSDL Trợ giúp pháp lý' },
];

const dataPermissionActions = [
  { id: 'view_collected', name: 'Xem dữ liệu thu thập' },
  { id: 'config_process', name: 'Cấu hình tham số xử lý' },
  { id: 'view_category', name: 'Xem dữ liệu danh mục' },
  { id: 'view_master', name: 'Xem dữ liệu chủ' },
  { id: 'view_source', name: 'Xem dữ liệu nguồn' },
  { id: 'config_api', name: 'Cấu hình API điều phối dữ liệu đi' }
];

const groupsData: Group[] = [
  { 
    id: 1, 
    name: 'Quản trị hệ thống', 
    code: 'QTHT', 
    description: 'Quản trị toàn bộ hệ thống', 
    department: 'Ban Quản trị', 
    memberCount: 5, 
    functionCount: 20, 
    createdDate: '01/01/2024', 
    status: 'active',
    members: [],
    functions: ['Toàn quyền']
  },
  { 
    id: 2, 
    name: 'Lãnh đạo Bộ phận quản trị', 
    code: 'LDBPQT', 
    description: 'Lãnh đạo bộ phận quản trị hệ thống', 
    department: 'Ban Quản trị', 
    memberCount: 2, 
    functionCount: 15, 
    createdDate: '01/01/2024', 
    status: 'active',
    members: [],
    functions: ['Xem báo cáo', 'Quản lý người dùng']
  },
  { 
    id: 3, 
    name: 'Cán bộ nghiệp vụ Hộ tịch điện tử', 
    code: 'HTDT', 
    description: 'Thực hiện nghiệp vụ hộ tịch điện tử', 
    department: 'Cục Hộ tịch', 
    memberCount: 30, 
    functionCount: 10, 
    createdDate: '05/01/2024', 
    status: 'active',
    members: [],
    functions: ['Thêm dữ liệu', 'Sửa dữ liệu', 'Xem dữ liệu']
  },
  { 
    id: 4, 
    name: 'Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch', 
    code: 'HSQT', 
    description: 'Nghiệp vụ quản lý hồ sơ quốc tịch', 
    department: 'Cục Quốc tịch', 
    memberCount: 20, 
    functionCount: 8, 
    createdDate: '10/01/2024', 
    status: 'active',
    members: [],
    functions: ['Thêm dữ liệu', 'Sửa dữ liệu', 'Xem dữ liệu']
  },
  { 
    id: 5, 
    name: 'Cán bộ nghiệp vụ thi hành án dân sự', 
    code: 'THADS', 
    description: 'Nghiệp vụ thi hành án dân sự', 
    department: 'Tổng cục THADS', 
    memberCount: 45, 
    functionCount: 12, 
    createdDate: '15/01/2024', 
    status: 'active',
    members: [],
    functions: ['Thêm dữ liệu', 'Sửa dữ liệu', 'Xem dữ liệu']
  },
  { 
    id: 6, 
    name: 'Cán bộ nghiệp vụ CSDL quốc gia về pháp luật', 
    code: 'CSDLPL', 
    description: 'Nghiệp vụ CSDL quốc gia về pháp luật', 
    department: 'Cục CNTT', 
    memberCount: 15, 
    functionCount: 14, 
    createdDate: '20/01/2024', 
    status: 'active',
    members: [],
    functions: ['Thêm dữ liệu', 'Sửa dữ liệu', 'Xem dữ liệu']
  },
  { 
    id: 7, 
    name: 'Lãnh đạo nghiệp vụ Hộ tịch điện tử', 
    code: 'LDHTDT', 
    description: 'Lãnh đạo phụ trách hộ tịch điện tử', 
    department: 'Cục Hộ tịch', 
    memberCount: 5, 
    functionCount: 15, 
    createdDate: '25/01/2024', 
    status: 'active',
    members: [],
    functions: ['Xem dữ liệu', 'Duyệt dữ liệu', 'Báo cáo']
  },
  { 
    id: 8, 
    name: 'Lãnh đạo nghiệp vụ quản lý hồ sơ quốc tịch', 
    code: 'LDHSQT', 
    description: 'Lãnh đạo phụ trách quản lý hồ sơ quốc tịch', 
    department: 'Cục Quốc tịch', 
    memberCount: 4, 
    functionCount: 15, 
    createdDate: '01/02/2024', 
    status: 'active',
    members: [],
    functions: ['Xem dữ liệu', 'Duyệt dữ liệu', 'Báo cáo']
  }
];

const availableUsers = [
  { id: 1, name: 'Nguyễn Văn An', email: 'nguyenvanan@moj.gov.vn', department: 'Vụ Pháp luật Dân sự' },
  { id: 2, name: 'Trần Thị Bình', email: 'tranthibinh@moj.gov.vn', department: 'Cục Đăng ký Quốc gia' },
  { id: 3, name: 'Lê Văn Cường', email: 'levancuong@moj.gov.vn', department: 'Cục Công chứng' },
  { id: 4, name: 'Phạm Thị Dung', email: 'phamthidung@moj.gov.vn', department: 'Cục Bổ trợ tư pháp' },
  { id: 5, name: 'Hoàng Văn Em', email: 'hoangvanem@moj.gov.vn', department: 'Vụ Tin học' },
];

const availableFunctions = [
  { id: 1, name: 'Xem dữ liệu', module: 'Dữ liệu' },
  { id: 2, name: 'Chỉnh sửa dữ liệu', module: 'Dữ liệu' },
  { id: 3, name: 'Xóa dữ liệu', module: 'Dữ liệu' },
  { id: 4, name: 'Xuất báo cáo', module: 'Báo cáo' },
  { id: 5, name: 'Nhập dữ liệu', module: 'Dữ liệu' },
  { id: 6, name: 'Phê duyệt', module: 'Quy trình' },
  { id: 7, name: 'Cấu hình hệ thống', module: 'Quản trị' },
  { id: 8, name: 'Quản lý người dùng', module: 'Quản trị' },
];

type ModalType = 'add' | 'edit' | 'detail' | 'delete' | 'add-members' | 'assign-functions' | null;
type DetailTabType = 'info' | 'function' | 'data';

export function GroupManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTabType>('info');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['data-collection']);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('dashboard');
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: string[] }>({});
  const [selectedDataPermissions, setSelectedDataPermissions] = useState<{ [key: string]: string[] }>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    status: 'active' as 'active' | 'inactive',
  });

  const filteredGroups = groupsData.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (type: ModalType, group?: Group, tab: DetailTabType = 'info') => {
    setModalType(type);
    if (group) {
      setSelectedGroup(group);
      if (type === 'edit') {
        setFormData({
          name: group.name,
          code: group.code,
          description: group.description,
          department: group.department,
          status: group.status,
        });
      }
      if (type === 'detail') {
        setActiveDetailTab(tab);
      }
    } else {
      setSelectedGroup(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        department: '',
        status: 'active',
      });
    }
    setSelectedUsers([]);
    setSelectedFunctions([]);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedGroup(null);
    setSelectedUsers([]);
    setSelectedFunctions([]);
    setActiveDetailTab('info');
  };

  const toggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const selectAllUsers = () => {
    setSelectedUsers(availableUsers.map(user => user.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const isAllSelected = selectedUsers.length === availableUsers.length && availableUsers.length > 0;
  const isSomeSelected = selectedUsers.length > 0 && selectedUsers.length < availableUsers.length;

  const toggleFunction = (functionId: number) => {
    if (selectedFunctions.includes(functionId)) {
      setSelectedFunctions(selectedFunctions.filter(id => id !== functionId));
    } else {
      setSelectedFunctions([...selectedFunctions, functionId]);
    }
  };

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const togglePermission = (functionId: string, action: string) => {
    const key = functionId;
    const current = selectedPermissions[key] || [];
    
    if (current.includes(action)) {
      setSelectedPermissions({
        ...selectedPermissions,
        [key]: current.filter(a => a !== action)
      });
    } else {
      setSelectedPermissions({
        ...selectedPermissions,
        [key]: [...current, action]
      });
    }
  };

  const toggleMenuItemSelection = (menuId: string) => {
    if (selectedMenuItems.includes(menuId)) {
      setSelectedMenuItems(selectedMenuItems.filter(id => id !== menuId));
    } else {
      setSelectedMenuItems([...selectedMenuItems, menuId]);
    }
  };

  const getAllSelectableMenuIds = (): string[] => {
    const selectableIds: string[] = [];
    
    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        const hasFunctions = item.functions && item.functions.length > 0;
        const hasChildren = item.children && item.children.length > 0;
        
        // Menu có thể chọn nếu có functions hoặc không có children
        if (hasFunctions || !hasChildren) {
          selectableIds.push(item.id);
        }
        
        if (hasChildren) {
          traverse(item.children!);
        }
      });
    };
    
    traverse(menuStructure);
    return selectableIds;
  };

  const selectAllMenuItems = () => {
    setSelectedMenuItems(getAllSelectableMenuIds());
  };

  const deselectAllMenuItems = () => {
    setSelectedMenuItems([]);
  };

  const isAllMenuItemsSelected = () => {
    const allSelectable = getAllSelectableMenuIds();
    return allSelectable.length > 0 && selectedMenuItems.length === allSelectable.length;
  };

  const isSomeMenuItemsSelected = () => {
    return selectedMenuItems.length > 0 && !isAllMenuItemsSelected();
  };

  const selectAllPermissionsForFunction = (functionId: string, actions: string[]) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [functionId]: actions
    });
  };

  const deselectAllPermissionsForFunction = (functionId: string) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [functionId]: []
    });
  };

  const isAllPermissionsSelectedForFunction = (functionId: string, actions: string[]): boolean => {
    const current = selectedPermissions[functionId] || [];
    return actions.length > 0 && current.length === actions.length;
  };

  const isSomePermissionsSelectedForFunction = (functionId: string, actions: string[]): boolean => {
    const current = selectedPermissions[functionId] || [];
    return current.length > 0 && current.length < actions.length;
  };

  const getSelectedMenuFunctions = (): MenuFunction[] => {
    const allFunctions: MenuFunction[] = [];
    
    selectedMenuItems.forEach(menuId => {
      for (const menu of menuStructure) {
        if (menu.id === menuId && menu.functions) {
          allFunctions.push(...menu.functions);
        }
        if (menu.children) {
          for (const child of menu.children) {
            if (child.id === menuId && child.functions) {
              allFunctions.push(...child.functions);
            }
          }
        }
      }
    });
    
    return allFunctions;
  };

  const getCurrentMenuFunctions = (menuId: string): MenuFunction[] => {
    // Tìm menu item dựa vào menuId
    for (const menu of menuStructure) {
      if (menu.id === menuId && menu.functions) {
        return menu.functions;
      }
      if (menu.children) {
        for (const child of menu.children) {
          if (child.id === menuId && child.functions) {
            return child.functions;
          }
        }
      }
    }
    return [];
  };

  const hasChildrenWithFunctions = (item: MenuItem): boolean => {
    return !!item.functions || !!(item.children && item.children.length > 0);
  };

  const renderMenuTree = (items: MenuItem[], level: number = 0) => {
    return items.map((item) => {
      const isExpanded = expandedMenus.includes(item.id);
      const isSelected = selectedMenuItems.includes(item.id);
      const hasChildren = item.children && item.children.length > 0;
      const hasFunctions = item.functions && item.functions.length > 0;
      const canBeSelected = hasFunctions || !hasChildren;

      return (
        <div key={item.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
          >
            {/* Checkbox for selectable items */}
            {canBeSelected && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleMenuItemSelection(item.id);
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            )}
            {!canBeSelected && <div className="w-4" />}
            
            {/* Expand/Collapse icon */}
            <div 
              onClick={() => {
                if (hasChildren) {
                  toggleMenu(item.id);
                }
              }}
              className="cursor-pointer flex items-center gap-2 flex-1"
            >
              {hasChildren && (
                isExpanded ? 
                  <ChevronDown className="w-4 h-4 flex-shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
              {!hasChildren && <div className="w-4" />}
              <span className={`text-sm flex-1 ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                {item.name}
              </span>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div>
              {renderMenuTree(item.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={UsersRound} iconColor="blue" title="Tổng nhóm" value="45" />
        <StatsCard icon={UsersRound} iconColor="green" title="Đang hoạt động" value="42" />
        <StatsCard icon={Users} iconColor="purple" title="Tổng thành viên" value="348" />
        <StatsCard icon={Users} iconColor="orange" title="TB thành viên/nhóm" value="8" />
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nhóm, mã nhóm, đơn vị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm nhóm mới
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-slate-900">{group.name}</h3>
                    <StatusTag label={group.code} variant="blue" />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{group.description}</p>
                  <p className="text-xs text-slate-500">{group.department}</p>
                </div>
                <div className="flex gap-2 ml-3">
                  <button 
                    onClick={() => handleOpenModal('edit', group)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded" 
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleOpenModal('delete', group)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded" 
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Thành viên</div>
                  <div className="text-slate-900">{group.memberCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Chức năng</div>
                  <div className="text-slate-900">{group.functionCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Trạng thái</div>
                  <StatusTag 
                    label={group.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                    variant={group.status === 'active' ? 'green' : 'slate'} 
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Tạo ngày: {group.createdDate}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button 
                onClick={() => handleOpenModal('detail', group, 'info')}
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Chi tiết
              </button>
              <button 
                onClick={() => handleOpenModal('add-members', group)}
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Thành viên
              </button>
              <button 
                onClick={() => handleOpenModal('detail', group, 'function')}
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Phân quyền
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-slate-900">
                {modalType === 'add' ? 'Thêm nhóm người dùng mới' : 'Chỉnh sửa nhóm người dùng'}
              </h3>
              <button title="Thêm mới" aria-label="Thêm mới" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Tên nhóm <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên nhóm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Mã nhóm <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: PLDC"
                      disabled={modalType === 'edit'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả về nhóm người dùng"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Đơn vị <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn đơn vị --</option>
                    <option value="Vụ Pháp luật Dân sự">Vụ Pháp luật Dân sự</option>
                    <option value="Cục Đăng ký Quốc gia">Cục Đăng ký Quốc gia</option>
                    <option value="Cục Công chứng">Cục Công chứng</option>
                    <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                    <option value="Vụ Tin học">Vụ Tin học</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalType === 'add' ? 'Thêm nhóm' : 'Lưu thay đổi'}
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal with Tabs */}
      {modalType === 'detail' && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-slate-900">Chi tiết nhóm: {selectedGroup.name}</h3>
                <p className="text-sm text-slate-600 mt-1">Mã nhóm: {selectedGroup.code}</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs Header */}
            <div className="px-6 border-b border-slate-200 flex gap-6 bg-slate-50">
              <button
                onClick={() => setActiveDetailTab('info')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeDetailTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Thông tin & Thành viên
              </button>
              <button
                onClick={() => setActiveDetailTab('function')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeDetailTab === 'function' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Phân quyền chức năng
              </button>
              <button
                onClick={() => setActiveDetailTab('data')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeDetailTab === 'data' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Phân quyền dữ liệu
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto">
              {activeDetailTab === 'info' && (
                <div className="p-6">
                  {/* Basic Info */}
                  <div className="mb-6">
                    <h4 className="text-slate-900 mb-4 pb-2 border-b border-slate-200">Thông tin chung</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Tên nhóm</div>
                        <div className="text-sm text-slate-900">{selectedGroup.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Mã nhóm</div>
                        <StatusTag label={selectedGroup.code} variant="blue" />
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-slate-500 mb-1">Mô tả</div>
                        <div className="text-sm text-slate-900">{selectedGroup.description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Đơn vị</div>
                        <div className="text-sm text-slate-900">{selectedGroup.department}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Trạng thái</div>
                        <StatusTag 
                          label={selectedGroup.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                          variant={selectedGroup.status === 'active' ? 'green' : 'slate'} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                      <h4 className="text-slate-900">Danh sách thành viên ({selectedGroup.memberCount})</h4>
                      <button 
                        onClick={() => {
                          handleCloseModal();
                          setTimeout(() => handleOpenModal('add-members', selectedGroup), 100);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <UserPlus className="w-4 h-4" />
                        Thêm thành viên
                      </button>
                    </div>
                    {selectedGroup.members.length > 0 ? (
                      <div className="space-y-2">
                        {selectedGroup.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <div className="text-sm text-slate-900">{member.name}</div>
                              <div className="text-xs text-slate-500">{member.email} • {member.role}</div>
                            </div>
                            <button className="text-red-600 hover:text-red-700 p-1" title="Xóa khỏi nhóm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        Chưa có thành viên nào trong nhóm
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDetailTab === 'function' && (
                <div className="flex h-full min-h-[500px]">
                  {/* Left Column - Menu Tree */}
                  <div className="w-80 border-r border-slate-200 overflow-y-auto p-4 bg-slate-50">
                    <h4 className="text-sm text-slate-700 mb-3 px-3">Danh sách chức năng</h4>
                    
                    <div className="mb-2">
                      <label className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100">
                        <input
                          type="checkbox"
                          checked={isAllMenuItemsSelected()}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = isSomeMenuItemsSelected();
                            }
                          }}
                          onChange={() => {
                            if (isAllMenuItemsSelected()) {
                              deselectAllMenuItems();
                            } else {
                              selectAllMenuItems();
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-blue-900">
                            {isAllMenuItemsSelected() 
                              ? 'Bỏ chọn tất cả' 
                              : isSomeMenuItemsSelected() 
                                ? `Chọn tất cả (đã chọn ${selectedMenuItems.length}/${getAllSelectableMenuIds().length})` 
                                : 'Chọn tất cả'}
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-1">
                      {renderMenuTree(menuStructure)}
                    </div>
                  </div>

                  {/* Right Column - Permission Checkboxes */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="text-sm text-slate-700 mb-4">
                      Chi tiết quyền chức năng
                      {selectedMenuItems.length > 0 && (
                        <span className="ml-2 text-blue-600">
                          ({selectedMenuItems.length} chức năng đã chọn)
                        </span>
                      )}
                    </h4>
                    
                    {getSelectedMenuFunctions().length > 0 ? (
                      <div className="space-y-4">
                        {getSelectedMenuFunctions().map((func) => (
                          <div key={func.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-medium text-slate-900">{func.name}</div>
                              <label className="flex items-center gap-2 text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                                <input
                                  type="checkbox"
                                  checked={isAllPermissionsSelectedForFunction(func.id, func.actions)}
                                  ref={(input) => {
                                    if (input) {
                                      input.indeterminate = isSomePermissionsSelectedForFunction(func.id, func.actions);
                                    }
                                  }}
                                  onChange={() => {
                                    if (isAllPermissionsSelectedForFunction(func.id, func.actions)) {
                                      deselectAllPermissionsForFunction(func.id);
                                    } else {
                                      selectAllPermissionsForFunction(func.id, func.actions);
                                    }
                                  }}
                                  className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span>Chọn tất cả</span>
                              </label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {func.actions.map((action) => (
                                <label
                                  key={`${func.id}-${action}`}
                                  className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={(selectedPermissions[func.id] || []).includes(action)}
                                    onChange={() => togglePermission(func.id, action)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-slate-700">{action}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        Vui lòng chọn chức năng từ danh sách bên trái
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDetailTab === 'data' && (
                <div className="flex h-full min-h-[500px]">
                  {/* Left Column - Data Sources */}
                  <div className="w-80 border-r border-slate-200 overflow-y-auto p-4 bg-slate-50">
                    <h4 className="text-sm text-slate-700 mb-3 px-3">Danh sách CSDL / Hệ thống nguồn</h4>
                    <div className="space-y-1">
                      {dataSources.map(source => {
                        const isSelected = selectedMenuItems.includes(source.id);
                        return (
                          <div
                            key={source.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors cursor-pointer ${
                              isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                            }`}
                            onClick={() => toggleMenuItemSelection(source.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer pointer-events-none"
                            />
                            <span className={`text-sm flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                              {source.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column - Data Permissions */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="text-sm text-slate-700 mb-4">
                      Chi tiết quyền dữ liệu
                      {selectedMenuItems.filter(id => dataSources.some(s => s.id === id)).length > 0 && (
                        <span className="ml-2 text-blue-600">
                          ({selectedMenuItems.filter(id => dataSources.some(s => s.id === id)).length} CSDL đã chọn)
                        </span>
                      )}
                    </h4>

                    {selectedMenuItems.filter(id => dataSources.some(s => s.id === id)).length > 0 ? (
                      <div className="space-y-4">
                        {selectedMenuItems.filter(id => dataSources.some(s => s.id === id)).map((sourceId) => {
                          const source = dataSources.find(s => s.id === sourceId);
                          if (!source) return null;
                          const currentActions = selectedDataPermissions[sourceId] || [];
                          const isAllActionsSelected = currentActions.length === dataPermissionActions.length;
                          const isSomeActionsSelected = currentActions.length > 0 && !isAllActionsSelected;

                          return (
                            <div key={sourceId} className="border border-slate-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-slate-900">{source.name}</div>
                                <label className="flex items-center gap-2 text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                                  <input
                                    type="checkbox"
                                    checked={isAllActionsSelected}
                                    ref={(input) => {
                                      if (input) input.indeterminate = isSomeActionsSelected;
                                    }}
                                    onChange={() => {
                                      if (isAllActionsSelected) {
                                        const newPerms = { ...selectedDataPermissions };
                                        newPerms[sourceId] = [];
                                        setSelectedDataPermissions(newPerms);
                                      } else {
                                        setSelectedDataPermissions({
                                          ...selectedDataPermissions,
                                          [sourceId]: dataPermissionActions.map(a => a.id)
                                        });
                                      }
                                    }}
                                    className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span>Chọn tất cả</span>
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {dataPermissionActions.map((action) => (
                                  <label
                                    key={`${sourceId}-${action.id}`}
                                    className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={currentActions.includes(action.id)}
                                      onChange={() => {
                                        const perms = { ...selectedDataPermissions };
                                        const current = perms[sourceId] || [];
                                        if (current.includes(action.id)) {
                                          perms[sourceId] = current.filter(a => a !== action.id);
                                        } else {
                                          perms[sourceId] = [...current, action.id];
                                        }
                                        setSelectedDataPermissions(perms);
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">{action.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        Vui lòng chọn CSDL/Hệ thống nguồn từ danh sách bên trái
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between bg-white flex-shrink-0">
              {activeDetailTab === 'info' ? (
                <button 
                  onClick={() => {
                    handleCloseModal();
                    setTimeout(() => handleOpenModal('edit', selectedGroup), 100);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Chỉnh sửa nhóm
                </button>
              ) : (
                <button 
                  onClick={() => {
                    // Xử lý lưu
                    alert(`Đã lưu phân quyền ${activeDetailTab === 'function' ? 'chức năng' : 'dữ liệu'} thành công!`);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu phân quyền
                </button>
              )}
              <button 
                onClick={handleCloseModal}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {modalType === 'add-members' && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-slate-900">Thêm thành viên vào nhóm</h3>
                <p className="text-sm text-slate-600 mt-1">Nhóm: {selectedGroup.name}</p>
              </div>
              <button title="Thêm mới" aria-label="Thêm mới" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Select All Checkbox */}
              <div className="mb-2">
                <label className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={() => {
                      if (isAllSelected) {
                        deselectAllUsers();
                      } else {
                        selectAllUsers();
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-blue-900">
                      {isAllSelected ? 'Bỏ chọn tất cả' : isSomeSelected ? `Chọn tất cả (đã chọn ${selectedUsers.length}/${availableUsers.length})` : 'Chọn tất cả'}
                    </div>
                  </div>
                </label>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                {availableUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email} • {user.department}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  disabled={selectedUsers.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Thêm {selectedUsers.length > 0 && `(${selectedUsers.length})`} thành viên
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation */}
      {modalType === 'delete' && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Xác nhận xóa nhóm</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Bạn có chắc chắn muốn xóa nhóm <span className="font-semibold">{selectedGroup.name}</span>?
              </p>
              <p className="text-sm text-red-600 mb-2">
                Lưu ý: Hành động này sẽ:
              </p>
              <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-4">
                <li>Xóa {selectedGroup.memberCount} thành viên khỏi nhóm</li>
                <li>Xóa {selectedGroup.functionCount} quyền đã gán</li>
                <li>Không thể hoàn tác!</li>
              </ul>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Xóa nhóm
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}