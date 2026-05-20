import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Lock, Unlock, X, Eye, UserPlus, RefreshCw, Upload, Download, Users } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { StatsCard } from '../../common/StatsCard';
import { ResetPasswordModal } from '../../user/ResetPasswordModal';
import { ImportExcelModal } from '../../user/ImportExcelModal';
import * as XLSX from 'xlsx';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  groups: string[];
  permissions: string[];
  status: 'active' | 'inactive' | 'locked';
  createdDate: string;
  lastLogin: string;
}

interface ImportUser {
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  errors: string[];
}

const usersData: User[] = [
  { 
    id: 1, 
    name: 'Nguyễn Văn An', 
    username: 'nguyenvanan', 
    email: 'nguyenvanan@moj.gov.vn', 
    phone: '0912345678', 
    department: 'Vụ Pháp luật Dân sự', 
    role: 'Quản trị viên',
    groups: ['Quản trị viên', 'Nhóm Pháp luật Dân sự'],
    permissions: ['Toàn quyền hệ thống', 'Quản lý người dùng', 'Cấu hình hệ thống'],
    status: 'active', 
    createdDate: '01/01/2024', 
    lastLogin: '5 phút trước' 
  },
  { 
    id: 2, 
    name: 'Trần Thị Bình', 
    username: 'tranthibinh', 
    email: 'tranthibinh@moj.gov.vn', 
    phone: '0912345679', 
    department: 'Cục Đăng ký Quốc gia', 
    role: 'Biên tập viên',
    groups: ['Biên tập viên'],
    permissions: ['Xem dữ liệu', 'Chỉnh sửa dữ liệu', 'Xuất báo cáo'],
    status: 'active', 
    createdDate: '05/01/2024', 
    lastLogin: '2 giờ trước' 
  },
  { 
    id: 3, 
    name: 'Lê Văn Cường', 
    username: 'levancuong', 
    email: 'levancuong@moj.gov.vn', 
    phone: '0912345680', 
    department: 'Cục Công chứng', 
    role: 'Người xem',
    groups: ['Người xem'],
    permissions: ['Xem dữ liệu'],
    status: 'inactive', 
    createdDate: '10/01/2024', 
    lastLogin: '2 ngày trước' 
  },
  { 
    id: 4, 
    name: 'Phạm Thị Dung', 
    username: 'phamthidung', 
    email: 'phamthidung@moj.gov.vn', 
    phone: '0912345681', 
    department: 'Cục Bổ trợ tư pháp', 
    role: 'Biên tập viên',
    groups: ['Biên tập viên'],
    permissions: ['Xem dữ liệu', 'Chỉnh sửa dữ liệu'],
    status: 'locked', 
    createdDate: '15/01/2024', 
    lastLogin: '7 ngày trước' 
  },
];

const availableGroups = [
  { id: 1, name: 'Quản trị hệ thống', code: 'QTHT' },
  { id: 2, name: 'Lãnh đạo Bộ phận quản trị', code: 'LDBPQT' },
  { id: 3, name: 'Cán bộ nghiệp vụ Hộ tịch điện tử', code: 'HTDT' },
  { id: 4, name: 'Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch', code: 'HSQT' },
  { id: 5, name: 'Cán bộ nghiệp vụ thi hành án dân sự', code: 'THADS' },
  { id: 6, name: 'Cán bộ nghiệp vụ CSDL quốc gia về pháp luật', code: 'CSDLPL' },
  { id: 7, name: 'Lãnh đạo nghiệp vụ Hộ tịch điện tử', code: 'LDHTDT' },
  { id: 8, name: 'Lãnh đạo nghiệp vụ quản lý hồ sơ quốc tịch', code: 'LDHSQT' },
];

type ModalType = 'add' | 'edit' | 'detail' | 'delete' | 'lock' | 'unlock' | 'assign-group' | 'reset-password' | 'import' | 'export' | 'sync' | null;

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    department: '',
    role: 'Người xem',
    status: 'active' as 'active' | 'inactive' | 'locked',
  });

  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (type: ModalType, user?: User) => {
    setModalType(type);
    if (user) {
      setSelectedUser(user);
      if (type === 'edit') {
        setFormData({
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          department: user.department,
          role: user.role,
          status: user.status,
        });
      }
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        department: '',
        role: 'Người xem',
        status: 'active',
      });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedGroups([]);
  };

  const toggleGroup = (groupId: number) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const handleImportUsers = (users: ImportUser[]) => {
    // Logic to import users
    console.log('Importing users:', users);
    alert(`Đã nhập khẩu thành công ${users.length} người dùng!`);
    handleCloseModal();
  };

  const handleExportUsers = () => {
    const exportData = [
      ['Họ và tên', 'Tên đăng nhập', 'Email', 'Số điện thoại', 'Đơn vị', 'Vai trò', 'Trạng thái'],
      ...filteredUsers.map(user => [
        user.name,
        user.username,
        user.email,
        user.phone,
        user.department,
        user.role,
        user.status
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Người dùng');
    XLSX.writeFile(wb, `danh_sach_nguoi_dung_${new Date().toISOString().split('T')[0]}.xlsx`);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Users} iconColor="blue" title="Tổng người dùng" value="2,847" />
        <StatsCard icon={Users} iconColor="green" title="Đang hoạt động" value="2,654" />
        <StatsCard icon={Users} iconColor="orange" title="Không hoạt động" value="158" />
        <StatsCard icon={Users} iconColor="red" title="Bị khóa" value="35" />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
          <button 
            onClick={() => handleOpenModal('sync')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Đồng bộ người dùng
          </button>
          <button 
            onClick={() => handleOpenModal('import')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Nhập khẩu
          </button>
          <button 
            onClick={() => handleOpenModal('export')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất khẩu
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Danh sách người dùng ({filteredUsers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên đăng nhập</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đơn vị</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nhóm người dùng</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đăng nhập</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.department}</td>
                  <td className="px-6 py-4">
                    <StatusTag label={user.role} variant="blue" />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        handleOpenModal('assign-group', user);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      {user.groups.length} nhóm
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag 
                      label={user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Không hoạt động' : 'Bị khóa'} 
                      variant={user.status === 'active' ? 'green' : user.status === 'inactive' ? 'slate' : 'red'} 
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal('detail', user)}
                        className="text-green-600 hover:text-green-700" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(user.status === 'locked' ? 'unlock' : 'lock', user)}
                        className="text-orange-600 hover:text-orange-700" 
                        title={user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                      >
                        {user.status === 'locked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleOpenModal('reset-password', user)}
                        className="text-blue-600 hover:text-blue-700" 
                        title="Đặt lại mật khẩu"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-slate-900">{modalType === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Họ và tên <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên đăng nhập <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên đăng nhập"
                    disabled={modalType === 'edit'}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Email <span className="text-red-600">*</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@moj.gov.vn"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0912345678"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-700 mb-2">Đơn vị <span className="text-red-600">*</span></label>
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
                  <label className="block text-sm text-slate-700 mb-2">Vai trò <span className="text-red-600">*</span></label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Biên tập viên">Biên tập viên</option>
                    <option value="Người xem">Người xem</option>
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
                    <option value="locked">Bị khóa</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalType === 'add' ? 'Thêm người dùng' : 'Lưu thay đổi'}
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

      {/* Detail Modal */}
      {modalType === 'detail' && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-slate-900">Chi tiết người dùng</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Basic Info */}
              <div className="mb-6">
                <h4 className="text-slate-900 mb-4 pb-2 border-b border-slate-200">Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Họ và tên</div>
                    <div className="text-sm text-slate-900">{selectedUser.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Tên đăng nhập</div>
                    <div className="text-sm text-slate-900">{selectedUser.username}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Email</div>
                    <div className="text-sm text-slate-900">{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Số điện thoại</div>
                    <div className="text-sm text-slate-900">{selectedUser.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Đơn vị</div>
                    <div className="text-sm text-slate-900">{selectedUser.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Vai trò</div>
                    <StatusTag label={selectedUser.role} variant="blue" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Trạng thái</div>
                    <StatusTag 
                      label={selectedUser.status === 'active' ? 'Hoạt động' : selectedUser.status === 'inactive' ? 'Không hoạt động' : 'Bị khóa'} 
                      variant={selectedUser.status === 'active' ? 'green' : selectedUser.status === 'inactive' ? 'slate' : 'red'} 
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Đăng nhập gần nhất</div>
                    <div className="text-sm text-slate-900">{selectedUser.lastLogin}</div>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div className="mb-6">
                <h4 className="text-slate-900 mb-4 pb-2 border-b border-slate-200">Nhóm người dùng ({selectedUser.groups.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.groups.map((group, index) => (
                    <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                      {group}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="text-slate-900 mb-4 pb-2 border-b border-slate-200">Quyền hạn ({selectedUser.permissions.length})</h4>
                <div className="space-y-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {permission}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Group Modal */}
      {modalType === 'assign-group' && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-slate-900">Gán nhóm người dùng</h3>
                <p className="text-sm text-slate-600 mt-1">Người dùng: {selectedUser.name}</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-2 mb-6">
                {availableGroups.map(group => (
                  <label
                    key={group.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id) || selectedUser.groups.includes(group.name)}
                      onChange={() => toggleGroup(group.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">{group.name}</div>
                      <div className="text-xs text-slate-500">Mã: {group.code}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Lưu thay đổi
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
      {modalType === 'delete' && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Xác nhận xóa người dùng</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold">{selectedUser.name}</span>?
              </p>
              <p className="text-sm text-red-600">
                Lưu ý: Hành động này không thể hoàn tác!
              </p>
              <div className="flex gap-3 mt-6">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Xóa người dùng
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

      {/* Lock/Unlock Confirmation */}
      {(modalType === 'lock' || modalType === 'unlock') && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">
                {modalType === 'lock' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Bạn có chắc chắn muốn {modalType === 'lock' ? 'khóa' : 'mở khóa'} tài khoản của{' '}
                <span className="font-semibold">{selectedUser.name}</span>?
              </p>
              {modalType === 'lock' && (
                <p className="text-sm text-orange-600">
                  Người dùng sẽ không thể đăng nhập cho đến khi tài khoản được mở khóa.
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <button className={`px-6 py-2 text-white rounded-lg ${
                  modalType === 'lock' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
                }`}>
                  {modalType === 'lock' ? 'Khóa tài khoản' : 'Mở khóa'}
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

      {/* Reset Password Modal */}
      {modalType === 'reset-password' && selectedUser && (
        <ResetPasswordModal
          isOpen={true}
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}

      {/* Import Modal */}
      {modalType === 'import' && (
        <ImportExcelModal
          isOpen={true}
          onClose={handleCloseModal}
          onImport={handleImportUsers}
        />
      )}

      {/* Export Modal */}
      {modalType === 'export' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-slate-900">Xuất khẩu người dùng</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-700">
                  Bạn có thể xuất khẩu danh sách người dùng ra file Excel. File Excel sẽ chứa các cột sau:
                </p>
                <ul className="list-disc list-inside">
                  <li>Họ và tên</li>
                  <li>Tên đăng nhập</li>
                  <li>Email</li>
                  <li>Số điện thoại</li>
                  <li>Đơn vị</li>
                  <li>Vai trò</li>
                  <li>Trạng thái (active, inactive, locked)</li>
                </ul>
                <div className="mt-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleExportUsers}>
                    Xuất khẩu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Users Modal */}
      {modalType === 'sync' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Xác nhận đồng bộ người dùng</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Hệ thống sẽ đồng bộ danh sách người dùng từ hệ thống LDAP/Active Directory của Bộ Tư pháp.
              </p>
              <p className="text-sm text-blue-600 mb-4">
                <strong>Lưu ý:</strong> Quá trình đồng bộ có thể mất vài phút. Các người dùng mới sẽ được thêm vào hệ thống, thông tin người dùng hiện có sẽ được cập nhật.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Logic đồng bộ người dùng
                    alert('Đang đồng bộ người dùng từ hệ thống LDAP...');
                    handleCloseModal();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Đồng bộ ngay
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