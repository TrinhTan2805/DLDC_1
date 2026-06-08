import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, Eye, UserPlus, Lock, User, Users, CheckCircle, ArrowRight, X, ChevronRight, ChevronDown } from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';
import { menuStructure } from './menuStructure';

interface RoleVersion {
  version: string;
  updatedDate: string;
  updatedBy: string;
  changes: string;
}

interface Role {
  id: number;
  name: string;
  roleType: string;
  description: string;
  memberCount: number;
  groupCount: number;
  createdDate: string;
  updatedDate?: string;
  status: 'active' | 'inactive';
  permissions: string[];     // Quyền chức năng
  dataPermissions: string[]; // Quyền dữ liệu
  version: string;
  history?: RoleVersion[];
  assignedUserIds?: number[];
  assignedGroupIds?: number[];
  unitAdmin?: string;
  selectedUnit?: string;
}

const mockUnits = [
  'Bộ Tư pháp',
  'Cục Công nghệ thông tin',
  'Cục Hành chính tư pháp',
  'Cục Quản lý thi hành án dân sự',
  'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước',
  'Cục Kiểm tra văn bản & Quản lý xử lý VPHC',
  'Cục Pháp luật quốc tế và Giải quyết tranh chấp...',
  'Cục Phổ biến, giáo dục pháp luật',
  'Cục Bổ trợ tư pháp',
  'Vụ Hợp tác quốc tế',
  'Cục Kế hoạch - Tài chính',
  'Vụ Pháp luật Dân sự',
  'Cục Đăng ký Quốc gia',
  'Cục Công chứng'
];

export const mockRoles: Role[] = mockUnits.map((unit, index) => ({
  id: index + 1,
  name: `Quản trị ${unit}`,
  roleType: 'Quản trị hệ thống nguồn',
  description: `Toàn quyền quản trị và khai thác dữ liệu cho ${unit}`,
  memberCount: Math.floor(Math.random() * 5) + 1,
  groupCount: Math.floor(Math.random() * 3) + 1,
  createdDate: '15/01/2024',
  updatedDate: '15/01/2024',
  status: 'active',
  permissions: ['Quản lý thu thập', 'Xử lý dữ liệu', 'Dữ liệu chủ', 'Quản lý dữ liệu mở'],
  dataPermissions: ['Thêm', 'Sửa', 'Xem', 'Tra cứu', 'Tải file'],
  version: 'v1.0',
  assignedUserIds: [1, 2],
  assignedGroupIds: [1, 2],
  selectedUnit: unit
}));

export const getRoles = (): Role[] => {
  const saved = localStorage.getItem('roles');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.length <= 3) return mockRoles;
    return parsed;
  }
  return mockRoles;
};

const availableUsers = [
  { id: 1, name: 'Nguyễn Văn An', email: 'nguyenvanan@moj.gov.vn', department: 'Vụ Pháp luật Dân sự' },
  { id: 2, name: 'Trần Thị Bình', email: 'tranthibinh@moj.gov.vn', department: 'Cục Đăng ký Quốc gia' },
  { id: 3, name: 'Lê Văn Cường', email: 'levancuong@moj.gov.vn', department: 'Cục Công chứng' },
  { id: 4, name: 'Phạm Thị D', email: 'ptd@moj.gov.vn', department: 'Bộ Tư pháp' },
  { id: 5, name: 'Hoàng Văn E', email: 'hve@moj.gov.vn', department: 'Cục Công nghệ thông tin' }
];

const availableGroups = [
  { id: 1, name: 'Ban Lãnh đạo Bộ', code: 'LDB-BTP', department: 'Bộ Tư pháp', memberCount: 5 },
  { id: 2, name: 'Quản trị hạ tầng & An ninh thông tin', code: 'QTHT-CNTT', department: 'Cục Công nghệ thông tin', memberCount: 8 },
  { id: 3, name: 'Nghiệp vụ Hộ tịch điện tử', code: 'NVHT-HCTP', department: 'Cục Hành chính tư pháp', memberCount: 15 },
  { id: 4, name: 'Nghiệp vụ Quốc tịch', code: 'NVQT-HCTP', department: 'Cục Hành chính tư pháp', memberCount: 10 },
  { id: 5, name: 'Chấp hành viên Thi hành án dân sự', code: 'CHV-THADS', department: 'Cục Quản lý thi hành án dân sự', memberCount: 25 }
];

const availableFunctionalPermissions = [
  'Xem tổng quan', 
  'Quản lý thu thập', 
  'Xử lý dữ liệu', 
  'Quản lý dữ liệu mở', 
  'Dữ liệu chủ', 
  'Cung cấp số liệu',
  'Quản lý vận hành'
];

const availableDataPermissions = [
  'Thêm', 
  'Sửa', 
  'Xóa', 
  'Xem', 
  'Tra cứu', 
  'Tải file'
];

const roleTypeTemplates = {
  'Quản trị hệ thống Kho DLDC': 'Bao gồm tất cả quyền xem, sửa, xóa các chức năng\nThiết lập kết nối cho tất cả CSDL\nThiết lập xử lý cho tất cả CSDL\nThiết lập chia sẻ cho tất cả CSDL\nThiết lập phân quyền quản trị cho các tài khoản quản trị viên',
  'Quản trị hệ thống nguồn': 'Xem dữ liệu theo hệ thống nguồn được phân quyền\nXem Dữ liệu được xử lý\nThiết lập dữ liệu chia sẻ',
  'Người dùng cơ bản': 'Xem tổng quan hệ thống\nXem dữ liệu theo hệ thống nguồn được phân quyền\nTra cứu thông tin dữ liệu\nKhông có quyền quản trị hệ thống'
};

type ModalType = 'add' | 'edit' | 'delete' | 'assign-users' | 'history' | null;

export function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>(getRoles);
  
  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);
  
  const [formData, setFormData] = useState({
    name: '',
    roleType: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    permissions: [] as string[],
    dataPermissions: [] as string[],
    unitAdmin: '',
    selectedUnit: ''
  });
  
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [assignTab, setAssignTab] = useState<'users' | 'groups'>('users');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [userDropdownSearch, setUserDropdownSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const getParentNodeIds = (items: any[]): string[] => {
    let ids: string[] = [];
    items.forEach(item => {
      const shouldHideChildren = 
        item.id === 'view-data-internal' || 
        item.id === 'view-data-external' ||
        item.id === 'processing-internal' ||
        item.id === 'processing-external' ||
        item.id === 'reconciliation-external-ministry' ||
        item.id === 'reconciliation-internal-ministry' ||
        item.id === 'provisioning-shared' ||
        item.id === 'provisioning-internal';
      if (item.children && item.children.length > 0 && !shouldHideChildren) {
        ids.push(item.id);
        ids = ids.concat(getParentNodeIds(item.children));
      }
    });
    return ids;
  };

  const getAllDescendants = (item: any): string[] => {
    let ids: string[] = [];
    const shouldHideChildren = 
      item.id === 'view-data-internal' || 
      item.id === 'view-data-external' ||
      item.id === 'processing-internal' ||
      item.id === 'processing-external' ||
      item.id === 'reconciliation-external-ministry' ||
      item.id === 'reconciliation-internal-ministry' ||
      item.id === 'provisioning-shared' ||
      item.id === 'provisioning-internal';

    if (item.children && item.children.length > 0 && !shouldHideChildren) {
      item.children.forEach((child: any) => {
        ids.push(child.id);
        ids = ids.concat(getAllDescendants(child));
      });
    }
    return ids;
  };

  const [assignmentSuccess, setAssignmentSuccess] = useState<{
    roleName: string;
    users: string[];
    groups: string[];
  } | null>(null);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allAssignedUserIds = new Set(roles.flatMap(r => r.assignedUserIds || []));

  const handleOpenModal = (type: ModalType, role?: Role) => {
    setModalType(type);
    setAssignTab('users');
    setGroupSearchTerm('');
    setUserSearchTerm('');
    if (role) {
      setSelectedRole(role);
      if (type === 'edit') {
        setFormData({
          name: role.name,
          roleType: role.roleType || '',
          description: role.description,
          status: role.status,
          permissions: role.permissions,
          dataPermissions: role.dataPermissions || [],
          unitAdmin: role.unitAdmin || '',
          selectedUnit: role.selectedUnit || ''
        });
      } else if (type === 'assign-users') {
        setSelectedUsers(role.assignedUserIds || []);
        setSelectedGroups(role.assignedGroupIds || []);
      }
    } else {
      setSelectedRole(null);
      setFormData({ name: '', roleType: '', description: '', status: 'active', permissions: [], dataPermissions: [], unitAdmin: '', selectedUnit: '' });
      setUserDropdownOpen(false);
      setUserDropdownSearch('');
    }
    
    setExpandedNodes([]);
    
    if (type !== 'assign-users') {
      setSelectedUsers([]);
      setSelectedGroups([]);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedRole(null);
    setExpandedNodes([]);
  };

  const handleSaveRole = () => {
    if (!formData.name.trim()) {
      alert('Ràng buộc tính hợp lệ: Tên vai trò không được để trống!');
      return;
    }

    const isDuplicate = roles.some(r => 
      r.name.toLowerCase().trim() === formData.name.toLowerCase().trim() && 
      (modalType === 'add' || r.id !== selectedRole?.id)
    );
    
    if (isDuplicate) {
      alert('Ràng buộc tính hợp lệ: Tên vai trò đã tồn tại trong hệ thống! Vui lòng chọn tên khác.');
      return;
    }

    if (modalType === 'add') {
      const today = new Date().toLocaleDateString('vi-VN');
      const newRole: Role = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        ...formData,
        roleType: formData.roleType || 'Người dùng cơ bản',
        memberCount: 0,
        groupCount: 0,
        createdDate: today,
        updatedDate: today,
        version: 'v1.0',
        history: [{
          version: 'v1.0',
          updatedDate: today,
          updatedBy: 'Nguyễn Văn An (Current User)',
          changes: 'Khởi tạo vai trò mới'
        }]
      };
      setRoles([...roles, newRole]);
      alert(`Ghi nhận vai trò mới "${formData.name}" thành công!`);
    } else if (modalType === 'edit' && selectedRole) {
      setRoles(roles.map(r => {
        if (r.id === selectedRole.id) {
          const currentVer = parseFloat(r.version?.replace('v', '') || '1.0');
          const nextVer = `v${(currentVer + 0.1).toFixed(1)}`;
          const today = new Date().toLocaleDateString('vi-VN');
          
          const changes = [];
          if (r.name !== formData.name) changes.push('Đổi tên');
          if (r.roleType !== formData.roleType) changes.push('Đổi loại vai trò');
          if (r.description !== formData.description) changes.push('Sửa mô tả');
          if (r.status !== formData.status) changes.push('Đổi trạng thái');
          if (JSON.stringify(r.permissions) !== JSON.stringify(formData.permissions)) changes.push('Cập nhật quyền chức năng');
          if (JSON.stringify(r.dataPermissions) !== JSON.stringify(formData.dataPermissions)) changes.push('Cập nhật quyền dữ liệu');

          const newHistoryEntry: RoleVersion = {
            version: nextVer,
            updatedDate: today,
            updatedBy: 'Nguyễn Văn An (Current User)',
            changes: changes.length > 0 ? changes.join(', ') : 'Cập nhật hệ thống'
          };

          return { 
            ...r, 
            ...formData,
            version: nextVer,
            updatedDate: today,
            history: [newHistoryEntry, ...(r.history || [])]
          };
        }
        return r;
      }));
      alert(`Đã ghi nhận phiên bản chỉnh sửa mới cho vai trò "${formData.name}"!`);
    }
    handleCloseModal();
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      if (selectedRole.memberCount > 0 || selectedRole.groupCount > 0) {
        alert('Ràng buộc hệ thống: Không thể xóa vai trò đã được gán cho người dùng hoặc nhóm người dùng!');
        return;
      }
      setRoles(roles.filter(r => r.id !== selectedRole.id));
      alert(`Đã xóa vai trò "${selectedRole.name}" thành công! Hệ thống đã ghi nhận nhật ký hành động xóa vai trò vào Nhật ký hệ thống.`);
      handleCloseModal();
    }
  };

  const handleAssignUsers = () => {
    if (selectedRole) {
      setRoles(roles.map(r => 
        r.id === selectedRole.id 
          ? { 
              ...r, 
              assignedUserIds: selectedUsers,
              assignedGroupIds: selectedGroups,
              memberCount: selectedUsers.length,
              groupCount: selectedGroups.length
            }
          : r
      ));

      const assignedUserNames = availableUsers
        .filter(u => selectedUsers.includes(u.id))
        .map(u => u.name);
      
      const assignedGroupNames = availableGroups
        .filter(g => selectedGroups.includes(g.id))
        .map(g => g.name);

      setAssignmentSuccess({
        roleName: selectedRole.name,
        users: assignedUserNames,
        groups: assignedGroupNames
      });

      handleCloseModal();
    }
  };

  const togglePermission = (perm: string) => {
    if (formData.permissions.includes(perm)) {
      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== perm) });
    } else {
      setFormData({ ...formData, permissions: [...formData.permissions, perm] });
    }
  };

  const toggleDataPermission = (perm: string) => {
    if (formData.dataPermissions.includes(perm)) {
      setFormData({ ...formData, dataPermissions: formData.dataPermissions.filter(p => p !== perm) });
    } else {
      setFormData({ ...formData, dataPermissions: [...formData.dataPermissions, perm] });
    }
  };

  const toggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleGroup = (groupId: number) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard icon={Shield} iconColor="blue" title="Tổng số vai trò" value={roles.length.toString()} />
        <StatsCard icon={Shield} iconColor="green" title="Vai trò hoạt động" value={roles.filter(r => r.status === 'active').length.toString()} />
        <StatsCard icon={User} iconColor="purple" title="Số người dùng được gán vai trò" value={roles.reduce((acc, r) => acc + r.memberCount, 0).toString()} />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            aria-label="Lọc trạng thái"
            title="Lọc trạng thái"
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
            Tạo vai trò
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-slate-900 font-bold">{role.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex-shrink-0">
                      {role.roleType}
                    </span>
                    <button 
                      onClick={() => handleOpenModal('history', role)}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-full border border-slate-200 flex-shrink-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer"
                      title="Xem chi tiết lịch sử phiên bản"
                    >
                      {role.version || 'v1.0'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{role.description}</p>
                  {role.updatedDate && (
                    <p className="text-[10px] text-slate-400">
                      Ghi nhận cập nhật: {role.updatedDate}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-3">
                  <button 
                    onClick={() => handleOpenModal('edit', role)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors" 
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleOpenModal('delete', role)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors" 
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
 
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Người dùng</div>
                  <div className="text-slate-900 font-semibold">{role.memberCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Nhóm ND</div>
                  <div className="text-slate-900 font-semibold">{role.groupCount || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Quyền CN</div>
                  <div className="text-slate-900 font-semibold">{role.permissions.length}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Trạng thái</div>
                  <div className="mt-0.5">
                    <StatusTag 
                      label={role.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                      variant={role.status === 'active' ? 'green' : 'slate'} 
                    />
                  </div>
                </div>
              </div>
            </div>
 

          </div>
        ))}
      </div>
 
      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-800">
                {modalType === 'add' ? 'Tạo vai trò mới' : `Chỉnh sửa vai trò (Phiên bản ${selectedRole?.version})`}
              </h3>
              <button aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tên vai trò <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Tên vai trò"
                    title="Tên vai trò"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="Nhập tên vai trò..."
                  />
                </div>


                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">Chọn đơn vị</label>
                    <select
                      title="Chọn đơn vị"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      value={formData.selectedUnit}
                      onChange={(e) => {
                        setFormData({ ...formData, selectedUnit: e.target.value, unitAdmin: '' });
                        setUserDropdownSearch('');
                      }}
                    >
                      <option value="">-- Chọn đơn vị --</option>
                      {mockUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">Chọn Quản lý đơn vị</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm pr-10"
                        placeholder="Tìm và chọn quản lý đơn vị..."
                        value={
                          userDropdownOpen
                            ? userDropdownSearch
                            : formData.unitAdmin
                              ? availableUsers.find(u => u.id.toString() === formData.unitAdmin)?.name || ''
                              : ''
                        }
                        onChange={(e) => {
                          setUserDropdownSearch(e.target.value);
                          setUserDropdownOpen(true);
                        }}
                        onFocus={() => {
                          setUserDropdownOpen(true);
                          if (!formData.unitAdmin) {
                            setUserDropdownSearch('');
                          } else {
                            const currentName = availableUsers.find(u => u.id.toString() === formData.unitAdmin)?.name || '';
                            setUserDropdownSearch(currentName);
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {formData.unitAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, unitAdmin: '' });
                              setUserDropdownSearch('');
                            }}
                            className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            title="Xóa lựa chọn"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <svg
                          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                          className={`w-4 h-4 text-slate-500 transition-transform cursor-pointer ${userDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    {userDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {availableUsers
                          .filter(u => !formData.selectedUnit || u.department === formData.selectedUnit)
                          .filter(u => 
                            u.name.toLowerCase().includes(userDropdownSearch.toLowerCase()) || 
                            u.email.toLowerCase().includes(userDropdownSearch.toLowerCase())
                          )
                          .map(u => (
                            <div
                              key={u.id}
                              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex flex-col ${formData.unitAdmin === u.id.toString() ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700'}`}
                              onClick={() => {
                                setFormData({ ...formData, unitAdmin: u.id.toString(), selectedUnit: u.department });
                                setUserDropdownOpen(false);
                                setUserDropdownSearch(u.name);
                              }}
                            >
                              <span className="font-medium text-slate-900">{u.name}</span>
                              <span className="text-[10px] text-slate-400">{u.email} • {u.department}</span>
                            </div>
                          ))}
                        {availableUsers
                          .filter(u => !formData.selectedUnit || u.department === formData.selectedUnit)
                          .filter(u => 
                            u.name.toLowerCase().includes(userDropdownSearch.toLowerCase()) || 
                            u.email.toLowerCase().includes(userDropdownSearch.toLowerCase())
                          ).length === 0 && (
                          <div className="px-4 py-3 text-sm text-slate-500 text-center italic">Không tìm thấy người dùng</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
 
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">Phân quyền module chức năng</label>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-[300px] overflow-y-auto pr-2">
                    {(() => {
                      const renderMenuTree = (items: any[], depth = 0) => {
                        return items.map(item => {
                          const isSelected = formData.permissions.includes(item.id);
                          const toggleSelection = () => {
                            const descendantIds = getAllDescendants(item);
                            if (isSelected) {
                              setFormData(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== item.id && !descendantIds.includes(p))
                              }));
                            } else {
                              const toAdd = [item.id, ...descendantIds];
                              setFormData(prev => {
                                const newPermissions = [...prev.permissions];
                                toAdd.forEach(id => {
                                  if (!newPermissions.includes(id)) {
                                    newPermissions.push(id);
                                  }
                                });
                                return { ...prev, permissions: newPermissions };
                              });
                            }
                          };

                          const shouldHideChildren = 
                            item.id === 'view-data-internal' || 
                            item.id === 'view-data-external' ||
                            item.id === 'processing-internal' ||
                            item.id === 'processing-external' ||
                            item.id === 'reconciliation-external-ministry' ||
                            item.id === 'reconciliation-internal-ministry' ||
                            item.id === 'provisioning-shared' ||
                            item.id === 'provisioning-internal';

                          const hasChildren = item.children && item.children.length > 0 && !shouldHideChildren;
                          const isExpanded = expandedNodes.includes(item.id);
                          const toggleExpand = (e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedNodes(prev => 
                              prev.includes(item.id) 
                                ? prev.filter(id => id !== item.id) 
                                : [...prev, item.id]
                            );
                          };

                          return (
                            <div key={item.id} className={depth === 0 ? "mb-3 break-inside-avoid" : "mt-2"}>
                              <div className="flex items-center gap-1">
                                {hasChildren ? (
                                  <button 
                                    type="button"
                                    onClick={toggleExpand}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-500 shrink-0 flex items-center justify-center"
                                    title={isExpanded ? "Thu gọn" : "Mở rộng"}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-5.5 shrink-0" />
                                )}
                                <label className="flex items-start gap-2 cursor-pointer py-1">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 cursor-pointer" 
                                    checked={isSelected} 
                                    onChange={toggleSelection} 
                                  />
                                  <span className={depth === 0 ? "text-sm font-semibold text-slate-800" : "text-sm font-medium text-slate-700"}>{item.name}</span>
                                </label>
                              </div>
                              {hasChildren && isExpanded && (
                                <div className="ml-6 border-l border-slate-200 pl-4 mt-1">
                                  {renderMenuTree(item.children, depth + 1)}
                                </div>
                              )}
                            </div>
                          );
                        });
                      };
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 items-start">
                          {renderMenuTree(menuStructure)}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Trạng thái
                  </label>
                  <select
                    aria-label="Trạng thái"
                    title="Trạng thái"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-sm bg-white"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>


              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveRole}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                disabled={!formData.name.trim()}
              >
                {modalType === 'add' ? 'Lưu vai trò' : 'Ghi nhận chỉnh sửa'}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa vai trò</h3>
              <div className="text-slate-500 mb-6 text-sm">
                Bạn có chắc chắn muốn xóa vai trò <span className="font-semibold text-slate-700">"{selectedRole.name}"</span> không?
                {(selectedRole.memberCount > 0 || selectedRole.groupCount > 0) && (
                  <div className="mt-3 text-red-500 text-xs bg-red-50 border border-red-200 p-3 rounded-lg text-left">
                    <span className="font-bold block mb-1">Cảnh báo ràng buộc: Không thể xóa vì:</span>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedRole.memberCount > 0 && <li>Đang được gán cho {selectedRole.memberCount} người dùng.</li>}
                      {selectedRole.groupCount > 0 && <li>Đang được gán cho {selectedRole.groupCount} nhóm người dùng.</li>}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDeleteRole}
                  disabled={selectedRole.memberCount > 0 || selectedRole.groupCount > 0}
                  className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Đồng ý xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Assign Users/Groups Modal */}
      {modalType === 'assign-users' && selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Gán vai trò cho người dùng/nhóm</h3>
                <p className="text-sm text-slate-500">Vai trò gán: {selectedRole.name}</p>
              </div>
              <button aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
 
            {/* Tabs Header */}
            <div className="px-6 border-b border-slate-200 flex gap-6 bg-slate-50/50">
              <button
                onClick={() => setAssignTab('users')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  assignTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
                Người dùng
              </button>
              <button
                onClick={() => setAssignTab('groups')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  assignTab === 'groups' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Nhóm người dùng
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {assignTab === 'users' ? (
                <>
                  <div className="mb-4">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm người dùng..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <input
                        type="checkbox"
                        checked={showUnassignedOnly}
                        onChange={(e) => setShowUnassignedOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600">Chỉ hiển thị người dùng chưa được gán vai trò nào</span>
                    </label>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                    {availableUsers
                      .filter(user => user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
                      .filter(user => !showUnassignedOnly || (!allAssignedUserIds.has(user.id) || selectedUsers.includes(user.id)))
                      .map(user => (
                        <label key={user.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email} • {user.department}</div>
                          </div>
                        </label>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={groupSearchTerm}
                        onChange={(e) => setGroupSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm nhóm người dùng..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                    {availableGroups
                      .filter(group => group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) || group.code.toLowerCase().includes(groupSearchTerm.toLowerCase()))
                      .map(group => (
                        <label key={group.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedGroups.includes(group.id)}
                            onChange={() => toggleGroup(group.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-900">{group.name}</span>
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 rounded">{group.code}</span>
                            </div>
                            <div className="text-xs text-slate-500">{group.department} • {group.memberCount} thành viên</div>
                          </div>
                        </label>
                      ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div className="text-sm text-slate-500">
                {assignTab === 'users' ? (
                  <>Đã chọn <span className="font-semibold text-slate-900">{selectedUsers.length}</span> người dùng</>
                ) : (
                  <>Đã chọn <span className="font-semibold text-slate-900">{selectedGroups.length}</span> nhóm</>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleAssignUsers}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Ghi nhận mối quan hệ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {modalType === 'history' && selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Lịch sử phiên bản</h3>
                <p className="text-sm text-slate-500">Vai trò: {selectedRole.name}</p>
              </div>
              <button aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                {(selectedRole.history || [{version: selectedRole.version, updatedDate: selectedRole.updatedDate || selectedRole.createdDate, updatedBy: 'Hệ thống', changes: 'Khởi tạo ban đầu'}]).map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shrink-0 z-10 ${index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <span className="text-[10px] font-bold">{item.version}</span>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-semibold text-slate-800 text-sm">{item.changes}</div>
                        <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{item.updatedDate}</div>
                      </div>
                      <div className="text-sm text-slate-600 flex items-center gap-1.5 mt-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                           <User className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-slate-700 text-xs">{item.updatedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Success Dialog */}
      {assignmentSuccess && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 text-center border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Gán vai trò thành công!</h3>
            <p className="text-sm text-slate-500 mb-4">
              Hệ thống đã cập nhật quan hệ giữa vai trò <span className="font-semibold text-blue-600">"{assignmentSuccess.roleName}"</span> và các đối tượng.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left border border-slate-200 max-h-60 overflow-y-auto space-y-3">
              {assignmentSuccess.users.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Cán bộ được gán ({assignmentSuccess.users.length})</span>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside pl-1 font-medium">
                    {assignmentSuccess.users.map(name => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {assignmentSuccess.groups.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Nhóm người dùng được gán ({assignmentSuccess.groups.length})</span>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside pl-1 font-medium">
                    {assignmentSuccess.groups.map(name => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {assignmentSuccess.users.length === 0 && assignmentSuccess.groups.length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-2">Đã thu hồi tất cả liên kết với vai trò này.</p>
              )}
            </div>
            
            <button
              onClick={() => setAssignmentSuccess(null)}
              className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Xác nhận hoàn tất</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
