import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, Eye, UserPlus, Lock, Settings, ChevronRight, ChevronDown, X, Filter, Building2 } from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';
import { UsersRound } from 'lucide-react';
import { menuStructure, type MenuItem, type MenuFunction } from './menuStructure';
import { getRoles } from './RoleManagementPage';

const isDatabaseOrSystemLeaf = (item: MenuItem): boolean => {
  const id = item.id;
  return (
    id.startsWith('data-info-') ||
    id.startsWith('external-') ||
    (id.startsWith('reconciliation-internal-') && id !== 'reconciliation-internal-ministry') ||
    (id.startsWith('reconciliation-external-') && id !== 'reconciliation-external-ministry') ||
    id.startsWith('processing-data-info-') ||
    id.startsWith('processing-external-') ||
    (id.startsWith('provisioning-shared-') && id !== 'provisioning-shared') ||
    (id.startsWith('provisioning-internal-') && id !== 'provisioning-internal') ||
    id === 'provisioning-open' ||
    id === 'provisioning-master'
  );
};

// Filter menu structure to remove CSDL/Hệ thống leaf nodes as per user request
const filterMenuStructure = (items: MenuItem[]): MenuItem[] => {
  return items
    .map(item => {
      if (isDatabaseOrSystemLeaf(item)) {
        return null;
      }
      if (item.children) {
        return {
          ...item,
          children: filterMenuStructure(item.children)
        };
      }
      return item;
    })
    .filter((item): item is MenuItem => item !== null);
};

const filteredMenuStructure = filterMenuStructure(menuStructure);

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

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
  role?: string;
  functionPermissions?: { [functionId: string]: string[] };
  dataPermissions?: { [sourceId: string]: { [tableId: string]: string[] } };
  groupAdmin?: string;
  modules?: string[];
}

export interface DatabaseTable {
  id: string;
  name: string;
}

export interface DataSource {
  id: string;
  name: string;
  tables: DatabaseTable[];
}

const commonTables: DatabaseTable[] = [
  { id: 'tb_khaisinh', name: 'Bộ dữ liệu hồ sơ đăng ký khai sinh' },
  { id: 'tb_kethon', name: 'Bộ dữ liệu hồ sơ đăng ký kết hôn' },
  { id: 'tb_khaitu', name: 'Bộ dữ liệu hồ sơ đăng ký khai tử' },
  { id: 'tb_nhanchamecon', name: 'Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con' },
  { id: 'tb_nuoiconnuoi', name: 'Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi' },
  { id: 'tb_giamho', name: 'Bộ dữ liệu hồ sơ đăng ký giám hộ' },
  { id: 'tb_chamdutgiamho', name: 'Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ' },
  { id: 'tb_thaydoi', name: 'Bộ hồ sơ đăng ký thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc' },
  { id: 'tb_giamsatgiamho', name: 'Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ' },
  { id: 'tb_chamdutgiamsat', name: 'Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ' },
  { id: 'tb_ghichulyhon', name: 'Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn)' },
];

const otherTables: DatabaseTable[] = [
  { id: 'tb_generic_1', name: 'Bảng dữ liệu chung 1' },
  { id: 'tb_generic_2', name: 'Bảng dữ liệu chung 2' },
  { id: 'tb_generic_3', name: 'Bảng danh mục' },
];

const dataSources: DataSource[] = [
  { id: 'data-info-civil-registry', name: 'CSDL Hộ tịch điện tử', tables: commonTables },
  { id: 'data-info-case-management', name: 'HT quản lý hồ sơ QT (3)', tables: otherTables },
  { id: 'data-info-civil-judgment', name: 'CSDL thi hành án dân sự (16)', tables: otherTables },
  { id: 'data-info-security-measures', name: 'CSDL về biện pháp BD (4)', tables: otherTables },
  { id: 'data-info-legal-national', name: 'CSDL quốc gia về PL (5)', tables: otherTables },
  { id: 'data-info-civil-legal-center', name: 'CSDL TT Tư Pháp dân sự (2)', tables: otherTables },
  { id: 'data-info-civil-legal-info', name: 'HTTT trợ giúp pháp lý (6)', tables: otherTables },
  { id: 'data-info-legal-center', name: 'Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở', tables: otherTables },
  { id: 'data-info-family-base', name: 'CSDL PB, GĐ và HG cơ sở (16)', tables: otherTables },
  { id: 'data-info-auction', name: 'CSDL quản lý đấu giá TS (24)', tables: otherTables },
  { id: 'data-info-international', name: 'CSDL Hợp tác quốc tế (6)', tables: otherTables },
  { id: 'external-court-judgment', name: 'CSDL Thông tin Bản án (1)', tables: otherTables },
  { id: 'external-category-group', name: 'Danh mục (8)', tables: otherTables },
  { id: 'external-social-security', name: 'BHXH và Giảm nghèo (7)', tables: otherTables },
  { id: 'external-meritorious-group', name: 'Người có công (3)', tables: otherTables },
  { id: 'external-children-group', name: 'Trẻ em (1)', tables: otherTables },
];

const dataPermissionActions = ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel'];

export const units = [
  { id: '1', name: 'Bộ Tư Pháp' },
  { id: '2', name: 'Cục Công nghệ thông tin' },
  { id: '3', name: 'Cục Hành chính tư pháp' },
  { id: '4', name: 'Cục Quản lý thi hành án dân sự' },
  { id: '5', name: 'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước' },
  { id: '6', name: 'Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính' },
  { id: '7', name: 'Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế' },
  { id: '8', name: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý' },
  { id: '9', name: 'Cục Bổ trợ tư pháp' },
  { id: '10', name: 'Vụ Hợp tác quốc tế' },
  { id: '11', name: 'Cục Kế hoạch - Tài chính' },
];

const generateGroupsAndUsers = () => {
  const groups: Group[] = [];
  const users: any[] = [];
  let groupId = 1;
  let userId = 1;

  units.forEach((unit, index) => {
    if (unit.name === 'Cục Hành chính tư pháp') {
      const specialGroups = [
        'Nhóm người dùng hồ sơ đăng ký khai sinh',
        'Nhóm người dùng hồ sơ đăng ký kết hôn',
        'Nhóm người dùng hồ sơ đăng ký khai tử',
        'Nhóm người dùng hồ sơ cấp giấy XNTNHN',
        'Nhóm người dùng hồ sơ đăng ký giám hộ',
        'Nhóm người dùng hồ sơ nhận cha, mẹ, con',
        'Nhóm người dùng hồ sơ thay đổi, cải chính hộ tịch',
        'Nhóm người dùng hồ sơ xác định lại dân tộc',
        'Nhóm người dùng hồ sơ khai sinh lưu động'
      ];
      specialGroups.forEach((groupName, i) => {
        groups.push({
          id: groupId++,
          name: groupName,
          code: `HCTP-${i+1}`,
          description: `Thực hiện ${groupName.toLowerCase()}`,
          department: unit.name,
          memberCount: Math.floor(Math.random() * 10) + 1,
          functionCount: 5,
          createdDate: '01/01/2024',
          status: 'active',
          members: [],
          functions: ['Xem dữ liệu', 'Sửa dữ liệu'],
          role: 'Người dùng cơ bản'
        });
      });
      // Thêm nhóm Quản trị dữ liệu
      groups.push({
        id: groupId++,
        name: `Nhóm quản trị dữ liệu`,
        code: `QT-${unit.id}`,
        description: `Quản lý, cấu hình và bảo mật dữ liệu tại ${unit.name}`,
        department: unit.name,
        memberCount: 3,
        functionCount: 20,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Cấu hình hệ thống', 'Quản trị danh mục', 'Phân quyền'],
        role: 'Quản trị hệ thống'
      });
    } else {
      // 3 user groups per unit as per requirement
      groups.push({
        id: groupId++,
        name: `Nhóm người dùng theo nghiệp vụ`,
        code: `NV-${unit.id}`,
        description: `Thực hiện các nghiệp vụ chuyên môn tại ${unit.name}`,
        department: unit.name,
        memberCount: 5,
        functionCount: 10,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Thêm dữ liệu', 'Sửa dữ liệu', 'Xem dữ liệu'],
        role: 'Người dùng cơ bản'
      });

      groups.push({
        id: groupId++,
        name: `Nhóm lãnh đạo nghiệp vụ`,
        code: `LD-${unit.id}`,
        description: `Phê duyệt, chỉ đạo hoạt động nghiệp vụ tại ${unit.name}`,
        department: unit.name,
        memberCount: 2,
        functionCount: 15,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Phê duyệt', 'Xem báo cáo', 'Xem dữ liệu'],
        role: 'Quản trị nghiệp vụ'
      });

      groups.push({
        id: groupId++,
        name: `Nhóm quản trị dữ liệu`,
        code: `QT-${unit.id}`,
        description: `Quản lý, cấu hình và bảo mật dữ liệu tại ${unit.name}`,
        department: unit.name,
        memberCount: 3,
        functionCount: 20,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Cấu hình hệ thống', 'Quản trị danh mục', 'Phân quyền'],
        role: 'Quản trị hệ thống'
      });
    }

    // 3 mock users per unit
    const unitUsers: any[] = [];
    unitUsers.push({ id: userId++, name: `Chuyên viên ${unit.id}`, email: `chuyenvien${unit.id}@moj.gov.vn`, department: unit.name });
    unitUsers.push({ id: userId++, name: `Lãnh đạo ${unit.id}`, email: `lanhdao${unit.id}@moj.gov.vn`, department: unit.name });
    unitUsers.push({ id: userId++, name: `Quản trị ${unit.id}`, email: `quantri${unit.id}@moj.gov.vn`, department: unit.name });
    users.push(...unitUsers);

    // Assign users to the groups of this unit
    groups.filter(g => g.department === unit.name).forEach(g => {
      // randomly assign 1 to 3 users
      const numUsers = Math.floor(Math.random() * 3) + 1;
      g.members = unitUsers.slice(0, numUsers);
      g.memberCount = g.members.length;
    });
  });

  return { groups, users };
};

const { groups: groupsData, users: availableUsers } = generateGroupsAndUsers();

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
type DetailTabType = 'info' | 'function' | 'data' | 'data-scope';

interface GroupManagementPageProps {
  currentPage?: string;
}

export function GroupManagementPage({ currentPage }: GroupManagementPageProps) {
  const [groups, setGroups] = useState<Group[]>(groupsData);

  useEffect(() => {
    setGroups(groupsData);
  }, [groupsData]);

  const [unitsList, setUnitsList] = useState<{id: string, name: string}[]>([]);
  const [selectedUnitIdState, setSelectedUnitIdState] = useState<string>('');
  const [unitSearchTerm, setUnitSearchTerm] = useState('');

  // Fetch units from roles on mount
  useEffect(() => {
    const roles = getRoles();
    const unitNames = roles.map(r => r.selectedUnit).filter(Boolean) as string[];
    const uniqueUnits = [...new Set(unitNames)];
    const dynamicUnits = uniqueUnits.map((name, index) => ({ id: String(index + 1), name }));
    
    setUnitsList(dynamicUnits);
    if (dynamicUnits.length > 0 && !selectedUnitIdState) {
      setSelectedUnitIdState(dynamicUnits[0].id);
    }
  }, []);

  // Sync selectedUnitIdState with global currentPage from Sidebar
  useEffect(() => {
    const unitId = currentPage?.replace('admin-groups-', '') || '';
    if (unitId && unitsList.some(u => u.id === unitId)) {
      setSelectedUnitIdState(unitId);
    } else if (!selectedUnitIdState && unitsList.length > 0) {
      setSelectedUnitIdState(unitsList[0].id);
    }
  }, [currentPage]);

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
  const [selectedDataPermissions, setSelectedDataPermissions] = useState<{ [sourceId: string]: { [tableId: string]: string[] } }>({});
  const [expandedDataSources, setExpandedDataSources] = useState<string[]>([]);
  const [selectedDataScopeCategory, setSelectedDataScopeCategory] = useState<string>('');
  
  // State to hold actual saved permissions per group
  const [savedMenuItems, setSavedMenuItems] = useState<{ [groupId: number]: string[] }>({});
  const [savedPermissions, setSavedPermissions] = useState<{ [groupId: number]: { [key: string]: string[] } }>({});
  const [savedDataPermissions, setSavedDataPermissions] = useState<{ [groupId: number]: { [sourceId: string]: { [tableId: string]: string[] } } }>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    status: 'active' as 'active' | 'inactive',
    role: '',
    groupAdmin: '',
    modules: [] as string[],
  });

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberDepartmentFilter, setMemberDepartmentFilter] = useState('');
  const [memberUnassignedOnly, setMemberUnassignedOnly] = useState(false);

  const currentUnit = unitsList.find(u => u.id === selectedUnitIdState);



  const filteredGroups = groups.filter(group => {
    const matchesUnit = currentUnit ? group.department === currentUnit.name : true;
    
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    
    return matchesUnit && matchesSearch && matchesStatus;
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
          role: group.role || '',
          groupAdmin: group.groupAdmin || '',
          modules: group.modules || [],
        });
      }
      if (type === 'detail') {
        setActiveDetailTab(tab);
        setSelectedDataScopeCategory('');
        if (tab === 'function') {
          setSelectedMenuItems(savedMenuItems[group.id] || []);
          setSelectedPermissions(savedPermissions[group.id] || {});
          setSelectedDataPermissions(savedDataPermissions[group.id] || {});
          setExpandedDataSources([]);
        }
      }
      if (type === 'add-members') {
        setSelectedUsers(group.members.map(m => m.id));
      } else {
        setSelectedUsers([]);
      }
    } else {
      setSelectedGroup(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        department: currentUnit ? currentUnit.name : '',
        status: 'active',
        role: '',
        groupAdmin: '',
        modules: [],
      });
      setSelectedUsers([]);
    }
    setSelectedFunctions([]);
  };

  const handleSaveMembers = () => {
    if (!selectedGroup) return;

    const usersToAdd = availableUsers
      .filter(u => selectedUsers.includes(u.id))
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.department
      }));

    const updatedGroup = {
      ...selectedGroup,
      members: usersToAdd,
      memberCount: usersToAdd.length
    };

    setGroups(prevGroups => prevGroups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
    
    setSelectedGroup(updatedGroup);
    alert('Đã lưu danh sách thành viên thành công!');
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedGroup(null);
    setSelectedUsers([]);
    setSelectedFunctions([]);
    setActiveDetailTab('info');
  };

  const handleSaveGroup = () => {
    if (!formData.name || !formData.code || !formData.department || !formData.role) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
      return;
    }

    if (modalType === 'add') {
      if (groups.some(g => g.code.toUpperCase() === formData.code.toUpperCase())) {
        alert('Mã nhóm đã tồn tại trong hệ thống!');
        return;
      }

      const newGroup: Group = {
        id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        department: formData.department,
        status: formData.status,
        role: formData.role,
        memberCount: 0,
        functionCount: 0,
        createdDate: new Date().toLocaleDateString('vi-VN'),
        members: [],
        functions: [],
        groupAdmin: formData.groupAdmin,
        modules: formData.modules
      };
      setGroups([...groups, newGroup]);
      alert('Thêm nhóm người dùng mới thành công!');
    } else if (modalType === 'edit' && selectedGroup) {
      setGroups(groups.map(g => g.id === selectedGroup.id ? {
        ...g,
        name: formData.name,
        description: formData.description,
        department: formData.department,
        status: formData.status,
        role: formData.role,
        groupAdmin: formData.groupAdmin,
        modules: formData.modules
      } : g));
      alert('Cập nhật nhóm người dùng thành công!');
    }
    handleCloseModal();
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      setGroups(groups.filter(g => g.id !== selectedGroup.id));
      alert('Xóa nhóm người dùng thành công!');
      handleCloseModal();
    }
  };

  const toggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const isUserAssignedToAnyGroup = (userId: number) => {
    return groups.some(g => g.members && g.members.some(m => m.id === userId));
  };

  const currentGroupRole = modalType === 'add-members' && selectedGroup ? getRoles().find(r => r.name === selectedGroup.role) : null;
  const validUserIds = currentGroupRole?.assignedUserIds || [];

  const filteredAvailableUsers = availableUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
                          user.department.toLowerCase().includes(memberSearchTerm.toLowerCase());
    const matchesDept = memberDepartmentFilter ? user.department === memberDepartmentFilter : true;
    
    return matchesSearch && matchesDept;
  });

  const selectAllUsers = () => {
    setSelectedUsers(filteredAvailableUsers.map(user => user.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const isAllSelected = selectedUsers.length === filteredAvailableUsers.length && filteredAvailableUsers.length > 0;
  const isSomeSelected = selectedUsers.length > 0 && selectedUsers.length < filteredAvailableUsers.length;

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

  const getRolePermissionsForGroup = () => {
    if (!selectedGroup) return [];
    const roleName = selectedGroup.role;
    const allRoles = getRoles();
    const role = allRoles.find(r => r.name === roleName || r.roleType === roleName);
    if (role) return role.permissions;
    
    // Fallback if role is not found but we know the name
    if (roleName === 'Quản trị hệ thống' || roleName === 'Quản trị hệ thống nguồn') {
      return ['Quản lý thu thập', 'Xử lý dữ liệu', 'Dữ liệu chủ', 'Quản lý dữ liệu mở', 'Xem tổng quan', 'Cung cấp số liệu', 'Quản lý vận hành'];
    }
    if (roleName === 'Quản trị nghiệp vụ') {
       return ['Xem tổng quan', 'Quản lý thu thập', 'Xử lý dữ liệu'];
    }
    if (roleName === 'Người dùng cơ bản') {
       return ['Xem tổng quan'];
    }
    return [];
  };

  const menuToPermissionMap: Record<string, string> = {
    'Tổng quan': 'Xem tổng quan',
    'Quản lý thu thập': 'Quản lý thu thập',
    'Xử lý dữ liệu': 'Xử lý dữ liệu',
    'Dữ liệu mở': 'Quản lý dữ liệu mở',
    'Quản lý dữ liệu chủ': 'Dữ liệu chủ',
    'Cung cấp dữ liệu': 'Cung cấp số liệu',
    'Quản trị & vận hành': 'Quản lý vận hành'
  };

  const getAuthorizedMenuStructure = () => {
    if (!selectedGroup) return filteredMenuStructure;
    
    const rolePermissions = getRolePermissionsForGroup();
    if (rolePermissions && rolePermissions.length > 0) {
      return filteredMenuStructure.filter(menuItem => {
        const requiredPermission = menuToPermissionMap[menuItem.name];
        if (requiredPermission) {
          return rolePermissions.includes(requiredPermission);
        }
        return true; 
      });
    }
    
    return filteredMenuStructure;
  };

  const authorizedMenuStructure = getAuthorizedMenuStructure();

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
    
    traverse(authorizedMenuStructure);
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

  const getMenuLabel = (id: string) => {
    let label = '';
    const traverse = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.id === id) {
          label = item.name;
          return true;
        }
        if (item.children && traverse(item.children)) {
          return true;
        }
      }
      return false;
    };
    traverse(filteredMenuStructure);
    return label;
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
    
    const findFunctions = (items: MenuItem[], targetId: string, currentPath: string[] = []) => {
      for (const item of items) {
        if (item.id === targetId && item.functions) {
          const augmentedFunctions = item.functions.map(f => ({
            ...f,
            name: currentPath.length > 0 ? `${currentPath[0]} > ${f.name}` : f.name
          }));
          allFunctions.push(...augmentedFunctions);
          return;
        }
        if (item.children) {
          findFunctions(item.children, targetId, [...currentPath, item.name]);
        }
      }
    };

    selectedMenuItems.forEach(menuId => {
      findFunctions(filteredMenuStructure, menuId);
    });
    
    return allFunctions;
  };

  const getCurrentMenuFunctions = (menuId: string): MenuFunction[] => {
    let result: MenuFunction[] = [];
    
    const findFunctions = (items: MenuItem[], targetId: string, currentPath: string[] = []) => {
      for (const item of items) {
        if (item.id === targetId && item.functions) {
          result = item.functions.map(f => ({
            ...f,
            name: currentPath.length > 0 ? `${currentPath[0]} > ${f.name}` : f.name
          }));
          return;
        }
        if (item.children) {
          findFunctions(item.children, targetId, [...currentPath, item.name]);
        }
      }
    };
    
    findFunctions(filteredMenuStructure, menuId);
    return result;
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
      const canBeSelected = hasFunctions;

      return (
        <div key={item.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
          >
            {Array.from({ length: level }).map((_, i) => (
              <div key={i} className="w-3 flex-shrink-0" />
            ))}
            {/* Checkbox for selectable items */}
            {canBeSelected && (
              <input
                type="checkbox"
                title={`Chọn ${item.name}`}
                aria-label={`Chọn ${item.name}`}
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
          {/* Inline Actions for selected menus that have functions */}
          {isSelected && hasFunctions && (
            <div className={`ml-[${level * 12 + 40}px] my-2 pl-4 border-l-2 border-slate-200`} style={{ marginLeft: `${level * 12 + 40}px` }}>
              {item.functions!.map(func => (
                <div key={func.id} className="flex flex-wrap gap-x-6 gap-y-2 items-center bg-white p-3 rounded border border-slate-100 shadow-sm">
                  <label className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold cursor-pointer shrink-0">
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
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    Chọn tất cả
                  </label>
                  <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
                  {func.actions.map(action => (
                    <label key={action} className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        checked={(selectedPermissions[func.id] || []).includes(action)}
                        onChange={() => togglePermission(func.id, action)}
                        className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      {action}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
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
    <div className="flex flex-row gap-6 items-start font-sans">
      {/* LEFT COLUMN: Danh mục đơn vị - Premium look like Image 2 */}
      <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col shrink-0 overflow-hidden self-stretch h-[calc(100vh-140px)] sticky top-4 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Danh mục đơn vị</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn vị..."
            value={unitSearchTerm}
            onChange={(e) => setUnitSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* List of Units */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {unitsList
            .filter((unit) =>
              unit.name.toLowerCase().includes(unitSearchTerm.toLowerCase())
            )
            .map((unit, index) => {
              const isActive = selectedUnitIdState === unit.id;
              return (
                <div
                  key={unit.id}
                  className={`group flex items-center justify-between rounded-lg p-2.5 transition-all text-xs cursor-pointer relative ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => setSelectedUnitIdState(unit.id)}
                >
                  <div className="flex items-center flex-1 min-w-0 gap-2">
                    <Building2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{unit.name}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* RIGHT COLUMN: Nhóm người dùng - Main content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quản lý nhóm người dùng</h2>
            <p className="text-sm text-slate-500 mt-1">
              Đơn vị quản lý: <span className="font-semibold text-blue-600">{currentUnit ? currentUnit.name : 'Tất cả đơn vị'}</span>
            </p>
          </div>
        </div>

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
              title="Lọc theo trạng thái"
              aria-label="Lọc theo trạng thái"
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
                  <p className="text-xs text-slate-500">Đơn vị: {group.department} • Vai trò: <span className="font-semibold text-blue-600">{group.role || 'Chưa gán'}</span></p>
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
      </div>

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-slate-900">
                {modalType === 'add' ? 'Thêm nhóm người dùng mới' : 'Chỉnh sửa nhóm người dùng'}
              </h3>
              <button title="Đóng" aria-label="Đóng" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
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
                    title="Đơn vị"
                    aria-label="Đơn vị"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={true}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none bg-slate-100 text-slate-500 cursor-not-allowed"
                  >
                    <option value="">{currentUnit ? '-- Chọn đơn vị --' : '-- Vui lòng chọn một đơn vị ở menu trái --'}</option>
                    {unitsList.map(unit => (
                      <option key={unit.id} value={unit.name}>{unit.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Vai trò <span className="text-red-600">*</span>
                  </label>
                  <select
                    title="Vai trò"
                    aria-label="Vai trò"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {getRoles().map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                  <select
                    title="Trạng thái"
                    aria-label="Trạng thái"
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
                <button 
                  onClick={handleSaveGroup}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-slate-900">
                  {activeDetailTab === 'function' || activeDetailTab === 'data' || activeDetailTab === 'data-scope' ? 'Phân quyền nhóm người dùng' : 'Chi tiết nhóm'}: {selectedGroup.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1">Mã nhóm: {selectedGroup.code}</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Navigation for Permissions */}
            {(activeDetailTab === 'function' || activeDetailTab === 'data' || activeDetailTab === 'data-scope') && (
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-4 items-center gap-6">
                <div className={`flex items-center gap-2 ${activeDetailTab === 'function' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeDetailTab === 'function' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</div>
                  Phân quyền chức năng & thao tác
                </div>
                <div className="h-px w-8 bg-slate-300"></div>
                <div className={`flex items-center gap-2 ${activeDetailTab === 'data-scope' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeDetailTab === 'data-scope' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</div>
                  Phạm vi dữ liệu
                </div>
              </div>
            )}

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
                        <div className="text-xs text-slate-500 mb-1">Vai trò</div>
                        <div className="text-sm text-slate-900">{selectedGroup.role || 'Chưa gán vai trò'}</div>
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
                            <button 
                              onClick={() => {
                                const newMembers = selectedGroup.members.filter(m => m.id !== member.id);
                                const updatedGroup = {
                                  ...selectedGroup,
                                  members: newMembers,
                                  memberCount: newMembers.length
                                };
                                setSelectedGroup(updatedGroup);
                                setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
                              }}
                              className="text-red-600 hover:text-red-700 p-1" title="Xóa khỏi nhóm"
                            >
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

                  {/* Functions */}
                  <div className="mb-6 mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                      <h4 className="text-slate-900">
                        Danh sách chức năng được phân quyền ({savedMenuItems[selectedGroup.id]?.length || 0})
                      </h4>
                    </div>
                    {(savedMenuItems[selectedGroup.id] && savedMenuItems[selectedGroup.id].length > 0) ? (
                      <div className="flex flex-wrap gap-2">
                        {savedMenuItems[selectedGroup.id].map((menuId, index) => {
                          const label = getMenuLabel(menuId);
                          if (!label) return null;
                          return (
                            <div key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-sm font-medium">
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        Nhóm này chưa được phân quyền chức năng nào
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDetailTab === 'function' && (
                <div className="h-full min-h-[500px] overflow-y-auto p-6 bg-white">
                  <div className="w-full border border-slate-200 rounded-lg p-6 bg-slate-50">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Bước 1: Phân quyền chức năng & thao tác</h4>
                    <p className="text-sm text-slate-600 mb-6">Vui lòng chọn các menu mà nhóm người dùng này được phép truy cập, sau đó chọn quyền thao tác tương ứng.</p>
                    
                    <div className="mb-4">
                      <label className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
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
                          <div className="text-sm text-slate-700">
                            {isAllMenuItemsSelected() 
                              ? 'Bỏ chọn tất cả' 
                              : isSomeMenuItemsSelected() 
                                ? `Chọn tất cả (đã chọn ${selectedMenuItems.length}/${getAllSelectableMenuIds().length})` 
                                : 'Chọn tất cả'}
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-1 bg-white border border-slate-200 rounded-lg p-4">
                      {renderMenuTree(authorizedMenuStructure)}
                    </div>
                  </div>
                </div>
              )}
              {activeDetailTab === 'data-scope' && (
                <div className="h-full min-h-[500px] overflow-y-auto p-6 bg-white">
                  <div className="w-full mb-8">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                      Chọn phạm vi dữ liệu
                    </h4>
                    <select
                      title="Chọn phạm vi dữ liệu"
                      aria-label="Chọn phạm vi dữ liệu"
                      value={selectedDataScopeCategory}
                      onChange={(e) => setSelectedDataScopeCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn phạm vi dữ liệu --</option>
                      <option value="Dữ liệu thu thập">Dữ liệu thu thập</option>
                      <option value="Dữ liệu tại CSDL đích (Dữ liệu đã xử lý)">Dữ liệu tại CSDL đích (Dữ liệu đã xử lý)</option>
                      <option value="Dữ liệu chia sẻ">Dữ liệu chia sẻ</option>
                      <option value="Dữ liệu mở">Dữ liệu mở</option>
                      <option value="Dữ liệu danh mục">Dữ liệu danh mục</option>
                      <option value="Dữ liệu chủ">Dữ liệu chủ</option>
                    </select>
                  </div>

                  {!selectedDataScopeCategory ? (
                    <div className="w-full mt-4">
                      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                        Vui lòng chọn phạm vi dữ liệu để phân quyền
                      </div>
                    </div>
                  ) : (
                    <div className="w-full transition-opacity duration-300 opacity-100 animate-in fade-in">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                        Bước 2: Phân quyền phạm vi dữ liệu
                      </h4>
                    <p className="text-sm text-slate-600 mb-6">Thiết lập phạm vi dữ liệu (Bảng, Trường dữ liệu, Bản ghi) được phép truy cập.</p>

                    <div className="space-y-6">
                      {/* CSDL Hộ Tịch */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                          <div className="font-medium text-slate-800">CSDL Hộ tịch điện tử</div>
                        </div>
                        <div className="p-4 space-y-5">
                          <div className="space-y-3 border border-slate-100 rounded p-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0 min-w-[220px]">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                                <span className="font-medium text-slate-800 text-sm">Bảng: Thông tin khai sinh</span>
                              </label>
                              
                              <select aria-label="Điều kiện hiển thị" title="Điều kiện hiển thị" className="text-sm border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700">
                                <option value="">Điều kiện hiển thị</option>
                                <option value="stt">STT</option>
                                <option value="province">Tỉnh/Thành phố</option>
                                <option value="dob">Ngày sinh</option>
                              </select>
                              
                              <input type="text" aria-label="Giá trị điều kiện hiển thị" title="Giá trị điều kiện hiển thị" className="text-sm border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none w-40 text-slate-700" placeholder="Nhập giá trị" />
                              
                              <div className="flex-1"></div>
                              
                              <select aria-label="Phạm vi dữ liệu" title="Phạm vi dữ liệu" className="text-sm border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700">
                                <option value="all">Xem toàn bộ bản ghi</option>
                                <option value="org">Chỉ xem dữ liệu cơ quan mình</option>
                                <option value="self">Chỉ xem dữ liệu do mình tạo</option>
                              </select>
                            </div>
                            
                            <div className="mt-2">
                              <div className="text-xs text-slate-500 mb-2">Trường dữ liệu được phép thao tác:</div>
                              <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Mã định danh</span></label>
                                <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Họ tên</span></label>
                                <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Ngày sinh</span></label>
                                <label className="flex items-center gap-1.5"><input type="checkbox" className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Giới tính</span></label>
                                <label className="flex items-center gap-1.5"><input type="checkbox" className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Dân tộc</span></label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 border border-slate-100 rounded p-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0 min-w-[220px]">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                                <span className="font-medium text-slate-800 text-sm">Bảng: Thông tin kết hôn</span>
                              </label>
                              
                              <select aria-label="Điều kiện hiển thị" title="Điều kiện hiển thị" className="text-sm border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700">
                                <option value="">Điều kiện hiển thị</option>
                                <option value="stt">STT</option>
                                <option value="province">Tỉnh/Thành phố</option>
                                <option value="date">Ngày đăng ký</option>
                              </select>
                              
                              <input type="text" aria-label="Giá trị điều kiện hiển thị" title="Giá trị điều kiện hiển thị" className="text-sm border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none w-40 text-slate-700" placeholder="Nhập giá trị" />
                              
                              <div className="flex-1"></div>
                              
                              <select aria-label="Phạm vi dữ liệu" title="Phạm vi dữ liệu" className="text-sm border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700">
                                <option value="all">Xem toàn bộ bản ghi</option>
                                <option value="org">Chỉ xem dữ liệu cơ quan mình</option>
                                <option value="self">Chỉ xem dữ liệu do mình tạo</option>
                              </select>
                            </div>
                            
                            <div className="mt-2">
                              <div className="text-xs text-slate-500 mb-2">Trường dữ liệu được phép thao tác:</div>
                              <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Mã định danh vợ/chồng</span></label>
                                <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Ngày đăng ký</span></label>
                                <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded" /><span className="text-sm text-slate-700">Nơi đăng ký</span></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CSDL Quốc Tịch */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                          <div className="font-medium text-slate-800">CSDL Quốc tịch</div>
                        </div>
                        <div className="p-4 space-y-5">
                          <div className="space-y-3 border border-slate-100 rounded p-3 bg-slate-50/50">
                            <div className="flex justify-between items-center">
                              <label className="flex items-center gap-2 cursor-pointer opacity-70">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                                <span className="font-medium text-slate-800 text-sm">Bảng: Hồ sơ xin thôi quốc tịch</span>
                              </label>
                              <select disabled aria-label="Phạm vi dữ liệu" title="Phạm vi dữ liệu" className="text-sm border border-slate-300 rounded px-2 py-1 bg-slate-100 text-slate-400">
                                <option>Xem toàn bộ bản ghi</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between bg-white flex-shrink-0">
              {activeDetailTab === 'info' ? (
                <>
                  <button 
                    onClick={() => {
                      handleCloseModal();
                      setTimeout(() => handleOpenModal('edit', selectedGroup), 100);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Chỉnh sửa nhóm
                  </button>
                  <button 
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                </>
              ) : activeDetailTab === 'function' ? (
                <>
                  <button 
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedMenuItems.length === 0) {
                        alert('Vui lòng chọn ít nhất một menu chức năng!');
                        return;
                      }
                      setActiveDetailTab('data-scope');
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Tiếp tục
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveDetailTab('function')}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Quay lại
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedGroup) {
                        setSavedMenuItems({ ...savedMenuItems, [selectedGroup.id]: selectedMenuItems });
                        setSavedPermissions({ ...savedPermissions, [selectedGroup.id]: selectedPermissions });
                      }
                      alert('Đã lưu cấu hình phân quyền thành công!');
                      handleCloseModal();
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu phân quyền
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {modalType === 'add-members' && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-slate-900">Thêm thành viên vào nhóm</h3>
                <p className="text-sm text-slate-600 mt-1">Nhóm: {selectedGroup.name}</p>
              </div>
              <button title="Đóng" aria-label="Đóng" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    title="Tìm kiếm người dùng"
                    aria-label="Tìm kiếm người dùng"
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm người dùng..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <select
                    title="Chọn đơn vị"
                    aria-label="Chọn đơn vị"
                    value={memberDepartmentFilter}
                    onChange={(e) => setMemberDepartmentFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả đơn vị</option>
                    {unitsList.map(unit => (
                      <option key={unit.id} value={unit.name}>{unit.name}</option>
                    ))}
                  </select>
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
                          {isAllSelected ? 'Bỏ chọn tất cả' : isSomeSelected ? `Chọn tất cả (đã chọn ${selectedUsers.length}/${filteredAvailableUsers.length})` : 'Chọn tất cả'}
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    {filteredAvailableUsers.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        Không tìm thấy người dùng phù hợp.
                      </div>
                    ) : (
                      filteredAvailableUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            title={`Chọn ${user.name}`}
                            aria-label={`Chọn ${user.name}`}
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email} • {user.department}</div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleSaveMembers}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu {selectedUsers.length > 0 && `(${selectedUsers.length})`} thành viên
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-slate-900">Xác nhận xóa nhóm</h3>
              <button title="Đóng" aria-label="Đóng" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
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
                <button 
                  onClick={handleDeleteGroup}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
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