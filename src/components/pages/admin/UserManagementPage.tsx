import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Lock, Unlock, X, Eye, UserPlus, RefreshCw, Download, Users, Filter } from 'lucide-react';
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
  status: 'active' | 'inactive';
  errors: string[];
}

const initialUsersData: User[] = [
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
    lastLogin: '10:30:15 21:05:2026' 
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
    lastLogin: '08:15:00 20:05:2026' 
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
    lastLogin: '14:20:30 19:05:2026' 
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
    status: 'inactive', 
    createdDate: '15/01/2024', 
    lastLogin: '09:05:10 14:05:2026' 
  },
  { 
    id: 5, 
    name: 'Hoàng Văn Đồng bộ', 
    username: 'hoangvandongbo', 
    email: 'hoangvandongbo@moj.gov.vn', 
    phone: '0912345682', 
    department: 'Cục Công nghệ thông tin', 
    role: '',
    groups: [],
    permissions: [],
    status: 'active', 
    createdDate: '29/05/2026', 
    lastLogin: '' 
  },
];

const availableRoles = ['Quản trị hệ thống', 'Quản trị nghiệp vụ', 'Người dùng cơ bản', 'Quản trị viên', 'Biên tập viên', 'Người xem'];

const availableGroups = [
  { id: 1, name: 'Quản trị hệ thống', code: 'QTHT', role: 'Quản trị hệ thống' },
  { id: 2, name: 'Lãnh đạo Bộ phận quản trị', code: 'LDBPQT', role: 'Quản trị nghiệp vụ' },
  { id: 3, name: 'Cán bộ nghiệp vụ Hộ tịch điện tử', code: 'HTDT', role: 'Người dùng cơ bản' },
  { id: 4, name: 'Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch', code: 'HSQT', role: 'Người dùng cơ bản' },
  { id: 5, name: 'Cán bộ nghiệp vụ thi hành án dân sự', code: 'THADS', role: 'Người dùng cơ bản' },
  { id: 6, name: 'Cán bộ nghiệp vụ CSDL quốc gia về pháp luật', code: 'CSDLPL', role: 'Người dùng cơ bản' },
  { id: 7, name: 'Lãnh đạo nghiệp vụ Hộ tịch điện tử', code: 'LDHTDT', role: 'Quản trị nghiệp vụ' },
  { id: 8, name: 'Lãnh đạo nghiệp vụ quản lý hồ sơ quốc tịch', code: 'LDHSQT', role: 'Quản trị nghiệp vụ' },
];

type ModalType = 'add' | 'edit' | 'detail' | 'delete' | 'lock' | 'unlock' | 'assign-group' | 'assign-role' | 'reset-password' | 'import' | 'export' | 'sync' | null;

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
    status: 'active' as 'active' | 'inactive',
  });

  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  const filteredUsers = users.filter(user => {
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

  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedGroups([]);
    setSelectedRole('');
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard icon={Users} iconColor="blue" title="Tổng người dùng" value="2,847" />
        <StatsCard icon={Users} iconColor="green" title="Đang hoạt động" value="2,654" />
        <StatsCard icon={Users} iconColor="orange" title="Không hoạt động" value="193" />
      </div>

      {/* Filters and Actions */}
      <div className="mb-6">
        {/* Row 1: Search and Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button title="Tìm kiếm" aria-label="Tìm kiếm" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenModal('sync')}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Đồng bộ
            </button>
            <button
              onClick={() => handleOpenModal('export')}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {/* Row 2: Filters (Collapsible) */}
        {showFilters && (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
            <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
              <select
                title="Lọc theo trạng thái"
                aria-label="Lọc theo trạng thái"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Họ tên</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên đăng nhập</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Email</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Đơn vị</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Vai trò</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Nhóm người dùng</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td className="px-4 py-3 text-left">
                      <div className="font-medium text-slate-950 leading-snug text-[13px]">{user.name}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-[13px] text-slate-700 font-medium">{user.username}</td>
                    <td className="px-4 py-3 text-center text-[13px] text-slate-700">{user.email}</td>
                    <td className="px-4 py-3 text-center text-[13px] text-slate-700 max-w-[120px]"><div className="leading-tight">{user.department}</div></td>
                    <td className="px-4 py-3 text-center">
                      {user.role ? (
                        <div 
                          onClick={() => { setSelectedUser(user); setSelectedRole(user.role); handleOpenModal('assign-role', user); }}
                          className="cursor-pointer hover:opacity-80 inline-block"
                          title="Đổi vai trò"
                        >
                          <StatusTag label={user.role} variant="blue" />
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setSelectedUser(user); setSelectedRole(''); handleOpenModal('assign-role', user); }}
                          className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs hover:bg-slate-200 transition-colors font-medium whitespace-nowrap"
                        >
                          Chọn vai trò
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          handleOpenModal('assign-group', user);
                        }}
                        className="text-[13px] text-blue-600 hover:text-blue-700 hover:underline flex items-center justify-center gap-1 mx-auto"
                      >
                        <UserPlus className="w-3 h-3" />
                        {user.groups.length} nhóm
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusTag 
                        label={user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                        variant={user.status === 'active' ? 'green' : 'slate'} 
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-[13px] text-slate-600 font-mono whitespace-nowrap">{user.lastLogin}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleOpenModal('detail', user)}
                          className="p-1.5 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(user.status === 'active' ? 'lock' : 'unlock', user)}
                          className={`p-1.5 rounded-lg transition-colors ${user.status === 'active' ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                          title={user.status === 'active' ? "Ngừng hoạt động" : "Kích hoạt"}
                        >
                          {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hiển thị</span>
            <select 
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
              title="Số bản ghi trên trang"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage) || filteredUsers.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
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
                    title="Đơn vị"
                    aria-label="Đơn vị"
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
                    title="Vai trò"
                    aria-label="Vai trò"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
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
                      label={selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                      variant={selectedUser.status === 'active' ? 'green' : 'slate'} 
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Đăng nhập gần nhất</div>
                    <div className="text-sm text-slate-900">{selectedUser.lastLogin}</div>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div>
                <h4 className="text-slate-900 mb-4 pb-2 border-b border-slate-200">Nhóm người dùng ({selectedUser.groups.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.groups.map((group, index) => (
                    <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                      {group}
                    </span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
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
                <button 
                  onClick={() => {
                    if (!selectedUser) return;
                    let newRole = selectedUser.role;
                    if (selectedGroups.length > 0) {
                      const firstGroup = availableGroups.find(g => g.id === selectedGroups[0]);
                      if (firstGroup) {
                        newRole = firstGroup.role;
                      }
                    }
                    const updatedGroups = selectedGroups.map(id => availableGroups.find(g => g.id === id)?.name || '');
                    const updatedUsers = users.map(u => 
                      u.id === selectedUser.id ? { ...u, groups: updatedGroups, role: newRole } : u
                    );
                    setUsers(updatedUsers);
                    handleCloseModal();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">
                {modalType === 'lock' ? 'Xác nhận ngừng hoạt động tài khoản' : 'Xác nhận kích hoạt tài khoản'}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Bạn có chắc chắn muốn {modalType === 'lock' ? 'ngừng hoạt động' : 'kích hoạt'} tài khoản của{' '}
                <span className="font-semibold">{selectedUser.name}</span>?
              </p>
              <div className="flex gap-3 mt-6">
                <button className={`px-6 py-2 text-white rounded-lg ${
                  modalType === 'lock' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
                }`}>
                  {modalType === 'lock' ? 'Ngừng hoạt động' : 'Kích hoạt'}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
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

      {/* Assign Role Modal */}
      {modalType === 'assign-role' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-slate-900">Gán vai trò</h3>
                <p className="text-sm text-slate-600 mt-1">Người dùng: <span className="font-medium text-slate-900">{selectedUser.name}</span></p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {availableRoles.map(role => (
                  <label key={role} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedRole === role ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      name="role-selection"
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-900 font-medium">{role}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const updatedUsers = users.map(u => 
                      u.id === selectedUser.id ? { ...u, role: selectedRole } : u
                    );
                    setUsers(updatedUsers);
                    handleCloseModal();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex-1"
                >
                  Lưu thay đổi
                </button>
                <button 
                  onClick={handleCloseModal} 
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm flex-1"
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