import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Shield, Eye, UserPlus, Lock, User, Users } from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';

interface Role {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  groupCount: number;
  createdDate: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Quản trị hệ thống',
    description: 'Toàn quyền quản trị hệ thống DLDC',
    memberCount: 3,
    groupCount: 1,
    createdDate: '01/01/2024',
    status: 'active',
    permissions: ['Quản lý người dùng', 'Cấu hình hệ thống', 'Quản lý vai trò']
  },
  {
    id: 2,
    name: 'Quản trị nghiệp vụ',
    description: 'Quản lý các nghiệp vụ cốt lõi, danh mục và dữ liệu',
    memberCount: 12,
    groupCount: 3,
    createdDate: '15/01/2024',
    status: 'active',
    permissions: ['Quản lý thu thập', 'Xử lý dữ liệu', 'Quản lý danh mục']
  },
  {
    id: 3,
    name: 'Người dùng cơ bản',
    description: 'Vai trò mặc định cho cán bộ khai thác',
    memberCount: 156,
    groupCount: 5,
    createdDate: '20/01/2024',
    status: 'active',
    permissions: ['Xem tổng quan', 'Khai thác dữ liệu']
  }
];

const availableUsers = [
  { id: 1, name: 'Nguyễn Văn An', email: 'nguyenvanan@moj.gov.vn', department: 'Vụ Pháp luật Dân sự' },
  { id: 2, name: 'Trần Thị Bình', email: 'tranthibinh@moj.gov.vn', department: 'Cục Đăng ký Quốc gia' },
  { id: 3, name: 'Lê Văn Cường', email: 'levancuong@moj.gov.vn', department: 'Cục Công chứng' }
];

const availableGroups = [
  { id: 1, name: 'Quản trị hệ thống', code: 'QTHT', department: 'Ban Quản trị', memberCount: 5 },
  { id: 2, name: 'Lãnh đạo Bộ phận quản trị', code: 'LDBPQT', department: 'Ban Quản trị', memberCount: 2 },
  { id: 3, name: 'Cán bộ nghiệp vụ Hộ tịch điện tử', code: 'HTDT', department: 'Cục Hộ tịch', memberCount: 30 },
  { id: 4, name: 'Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch', code: 'HSQT', department: 'Cục Quốc tịch', memberCount: 20 },
  { id: 5, name: 'Cán bộ nghiệp vụ thi hành án dân sự', code: 'THADS', department: 'Tổng cục THADS', memberCount: 45 }
];

const availablePermissions = [
  'Quản lý người dùng', 'Cấu hình hệ thống', 'Quản lý vai trò',
  'Quản lý thu thập', 'Xử lý dữ liệu', 'Quản lý danh mục',
  'Xem tổng quan', 'Khai thác dữ liệu', 'Báo cáo thống kê'
];

type ModalType = 'add' | 'edit' | 'delete' | 'assign-users' | null;

export function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    permissions: [] as string[]
  });
  
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [assignTab, setAssignTab] = useState<'users' | 'groups'>('users');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          description: role.description,
          status: role.status,
          permissions: role.permissions
        });
      } else if (type === 'assign-users') {
        if (role.id === 1) {
          setSelectedUsers([1]);
          setSelectedGroups([1]);
        } else if (role.id === 2) {
          setSelectedUsers([1, 2]);
          setSelectedGroups([2, 3]);
        } else {
          setSelectedUsers([3]);
          setSelectedGroups([4, 5]);
        }
      }
    } else {
      setSelectedRole(null);
      setFormData({ name: '', description: '', status: 'active', permissions: [] });
    }
    
    if (type !== 'assign-users') {
      setSelectedUsers([]);
      setSelectedGroups([]);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedRole(null);
  };

  const handleSaveRole = () => {
    if (modalType === 'add') {
      const newRole: Role = {
        id: roles.length + 1,
        ...formData,
        memberCount: 0,
        groupCount: 0,
        createdDate: new Date().toLocaleDateString('vi-VN')
      };
      setRoles([...roles, newRole]);
    } else if (modalType === 'edit' && selectedRole) {
      setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...formData } : r));
    }
    handleCloseModal();
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      if (selectedRole.memberCount > 0) {
        alert('Không thể xóa vai trò đã được gán cho người dùng!');
        return;
      }
      setRoles(roles.filter(r => r.id !== selectedRole.id));
      handleCloseModal();
    }
  };

  const handleAssignUsers = () => {
    if (selectedRole) {
      const initialUsersCount = selectedRole.id === 1 ? 1 : selectedRole.id === 2 ? 2 : 1;
      const initialGroupsCount = selectedRole.id === 1 ? 1 : selectedRole.id === 2 ? 2 : 2;
      
      const diffUsers = selectedUsers.length - initialUsersCount;
      const diffGroups = selectedGroups.length - initialGroupsCount;

      setRoles(roles.map(r => 
        r.id === selectedRole.id 
          ? { 
              ...r, 
              memberCount: Math.max(0, r.memberCount + diffUsers),
              groupCount: Math.max(0, (r.groupCount || 0) + diffGroups)
            }
          : r
      ));
      alert('Gán vai trò thành công!');
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Shield} iconColor="blue" title="Tổng số vai trò" value={roles.length.toString()} />
        <StatsCard icon={Shield} iconColor="green" title="Vai trò hoạt động" value={roles.filter(r => r.status === 'active').length.toString()} />
        <StatsCard icon={User} iconColor="purple" title="Số người dùng được gán vai trò" value={roles.reduce((acc, r) => acc + r.memberCount, 0).toString()} />
        <StatsCard icon={Users} iconColor="orange" title="Số nhóm người dùng được gán vai trò" value={roles.reduce((acc, r) => acc + (r.groupCount || 0), 0).toString()} />
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
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-slate-900 font-bold">{role.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{role.description}</p>
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
                  <div className="text-xs text-slate-500 mb-1">Quyền hạn</div>
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

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button 
                onClick={() => handleOpenModal('assign-users', role)}
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Gán vai trò
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-800">
                {modalType === 'add' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="VD: Quản trị viên"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Mô tả quyền hạn của vai trò này"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phân quyền chức năng/dữ liệu</label>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
                    {availablePermissions.map(perm => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                disabled={!formData.name}
              >
                {modalType === 'add' ? 'Lưu vai trò' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && selectedRole && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa vai trò</h3>
              <p className="text-slate-500 mb-6">
                Bạn có chắc chắn muốn xóa vai trò <span className="font-semibold text-slate-700">"{selectedRole.name}"</span> không?
                {selectedRole.memberCount > 0 && (
                  <span className="block mt-2 text-red-500 text-sm bg-red-50 p-2 rounded">
                    Cảnh báo: Không thể xóa vì đang có {selectedRole.memberCount} người dùng được gán vai trò này!
                  </span>
                )}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDeleteRole}
                  disabled={selectedRole.memberCount > 0}
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Gán vai trò & Phân quyền</h3>
                <p className="text-sm text-slate-500">Vai trò: {selectedRole.name}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
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
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm người dùng..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                    {availableUsers
                      .filter(user => user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
                      .map(user => (
                        <label key={user.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
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
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
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
                  <>Đã chọn <span className="font-semibold text-slate-900">{selectedGroups.length}</span> nhóm người dùng</>
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
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
