import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Lock, Unlock, X, Eye, UserPlus, RefreshCw, Download, Users, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '../../common/ConfirmModal';
import {
  Badge, TruncatedText, RowIconAction, Pagination,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK,
  FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  normalizeSearch, formatDateVN,
} from '../collection/collectionUi';
import { ResetPasswordModal } from '../../user/ResetPasswordModal';
import { ImportExcelModal, type ImportUser } from '../../user/ImportExcelModal';
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

// Người dùng kéo về từ nguồn (staging) — theo shape API thật
interface SyncUser {
  userId: number;
  userName: string;
  fullName: string;
  email: string;
  cellphone: string;
  identityCard: string;
  deptCode: string;
  deptName: string;
  posCode: string;
  status: number; // 1 = active
  update_date: string;
  approvalStatus: 'pending' | 'approved'; // field client
}

// Trạng thái đồng bộ của 1 dòng kéo về (so sánh với danh sách user thật)
type SyncStatus = 'err' | 'new' | 'upd' | 'same';

const initialSyncUsersData: SyncUser[] = [
  // Chưa có trong users -> Thêm mới
  {
    userId: 1001, userName: 'vuthimai', fullName: 'Vũ Thị Mai', email: 'vuthimai@moj.gov.vn',
    cellphone: '0987654321', identityCard: '001190001234', deptCode: 'CDKQG', deptName: 'Cục Đăng ký Quốc gia',
    posCode: 'Biên tập viên', status: 1, update_date: '08/07/2026 09:15:00', approvalStatus: 'pending',
  },
  {
    userId: 1002, userName: 'dangvanhung', fullName: 'Đặng Văn Hùng', email: 'dangvanhung@moj.gov.vn',
    cellphone: '0987654322', identityCard: '001190005678', deptCode: 'CCC', deptName: 'Cục Công chứng',
    posCode: 'Người xem', status: 1, update_date: '08/07/2026 09:16:00', approvalStatus: 'pending',
  },
  // Trùng username 'tranthibinh' + khác thông tin -> Cập nhật
  {
    userId: 1003, userName: 'tranthibinh', fullName: 'Trần Thị Bình', email: 'tranthibinh_new@moj.gov.vn',
    cellphone: '0912345679', identityCard: '001190009012', deptCode: 'VPLDS', deptName: 'Vụ Pháp luật Dân sự',
    posCode: 'Quản trị viên', status: 1, update_date: '08/07/2026 09:17:00', approvalStatus: 'pending',
  },
  // Trùng username 'levancuong' + giống hệt -> Không thay đổi
  {
    userId: 1004, userName: 'levancuong', fullName: 'Lê Văn Cường', email: 'levancuong@moj.gov.vn',
    cellphone: '0912345680', identityCard: '001190003456', deptCode: 'CCC', deptName: 'Cục Công chứng',
    posCode: 'Người xem', status: 1, update_date: '08/07/2026 09:18:00', approvalStatus: 'pending',
  },
  // Thiếu email -> Lỗi
  {
    userId: 1005, userName: 'phamvanloi', fullName: 'Phạm Văn Lợi', email: '',
    cellphone: '0987654323', identityCard: '001190007890', deptCode: 'CBTTP', deptName: 'Cục Bổ trợ tư pháp',
    posCode: 'Biên tập viên', status: 1, update_date: '08/07/2026 09:19:00', approvalStatus: 'pending',
  },
  // Chưa có trong users -> Thêm mới
  {
    userId: 1006, userName: 'ngothihoa', fullName: 'Ngô Thị Hoa', email: 'ngothihoa@moj.gov.vn',
    cellphone: '0987654324', identityCard: '001190002468', deptCode: 'CCNTT', deptName: 'Cục Công nghệ thông tin',
    posCode: 'Người xem', status: 1, update_date: '08/07/2026 09:20:00', approvalStatus: 'pending',
  },
];

// Lớp dùng chung cho bảng (compomennt.md 5.3) và modal (5.4)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3';

// lastLogin/createdDate là trường mock ngoài interface User — chỉ đọc để hiển thị
const getLastLogin = (u: User): string => ((u as any).lastLogin as string) || '';

// Tách ngày giờ để hiển thị 2 dòng dd/mm/yyyy + HH:mm:ss (5.3.3); chỉ đổi cách hiển thị, không đổi dữ liệu.
// Hỗ trợ 'HH:mm:ss dd:mm:yyyy' (lastLogin mock) và 'dd/mm/yyyy HH:mm:ss'.
const splitDateTime = (value: string): { date: string; time: string } => {
  const v = (value || '').trim();
  if (!v) return { date: '-', time: '' };
  const timeFirst = /^(\d{2}:\d{2}(?::\d{2})?)\s+(\d{2})[:/](\d{2})[:/](\d{4})$/.exec(v);
  if (timeFirst) return { date: `${timeFirst[2]}/${timeFirst[3]}/${timeFirst[4]}`, time: timeFirst[1] };
  const dateFirst = /^(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}(?::\d{2})?)$/.exec(v);
  if (dateFirst) return { date: dateFirst[1], time: dateFirst[2] };
  return { date: v, time: '' };
};

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
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterStatus: 'all', filterDepartment: 'all', filterGroup: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [prevModalType, setPrevModalType] = useState<ModalType>(null);
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

  // Sync (đồng bộ có bước duyệt) states
  const [syncUsers, setSyncUsers] = useState<SyncUser[]>(initialSyncUsersData);
  const [syncSearch, setSyncSearch] = useState('');
  const [syncAppliedSearch, setSyncAppliedSearch] = useState('');
  const [syncFilterStatus, setSyncFilterStatus] = useState<'all' | SyncStatus>('all');
  const [syncFilterApproval, setSyncFilterApproval] = useState<'all' | 'pending' | 'approved'>('all');
  const [syncSelectedIds, setSyncSelectedIds] = useState<number[]>([]);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncDetail, setSyncDetail] = useState<SyncUser | null>(null);

  // Tính trạng thái đồng bộ 1 dòng kéo về, khớp theo userName với users hiện tại
  const getSyncStatus = (row: SyncUser): SyncStatus => {
    if (!row.email || !row.userName || !row.fullName) return 'err';
    const matched = users.find(u => u.username.toLowerCase() === row.userName.toLowerCase());
    if (!matched) return 'new';
    const isSame =
      row.fullName === matched.name &&
      row.email === matched.email &&
      row.deptName === matched.department &&
      row.posCode === matched.role;
    return isSame ? 'same' : 'upd';
  };

  const syncStatusLabel: Record<SyncStatus, string> = {
    err: 'Lỗi',
    new: 'Thêm mới',
    upd: 'Cập nhật',
    same: 'Không thay đổi',
  };
  // Màu Badge (5.8) theo trạng thái đồng bộ — giữ ý nghĩa màu cũ
  const syncStatusBadge: Record<SyncStatus, string> = {
    err: 'red',
    new: 'green',
    upd: 'blue',
    same: 'slate',
  };
  const isApprovable = (row: SyncUser) => {
    const st = getSyncStatus(row);
    return (st === 'new' || st === 'upd') && row.approvalStatus === 'pending';
  };

  const filteredSyncUsers = syncUsers.filter(row => {
    const term = normalizeSearch(syncAppliedSearch);
    const matchesSearch =
      !term ||
      normalizeSearch(row.fullName).includes(term) ||
      normalizeSearch(row.userName).includes(term) ||
      normalizeSearch(row.email).includes(term);
    const matchesStatus = syncFilterStatus === 'all' || getSyncStatus(row) === syncFilterStatus;
    const matchesApproval = syncFilterApproval === 'all' || row.approvalStatus === syncFilterApproval;
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const toggleSyncSelect = (row: SyncUser) => {
    if (!isApprovable(row)) return;
    setSyncSelectedIds(prev =>
      prev.includes(row.userId) ? prev.filter(id => id !== row.userId) : [...prev, row.userId]
    );
  };

  // Áp 1 dòng kéo về vào danh sách user thật
  const applySyncRowToUsers = (row: SyncUser, currentUsers: User[]): User[] => {
    const st = getSyncStatus(row);
    if (st === 'new') {
      const newUser: User = {
        id: currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id)) + 1 : 1,
        name: row.fullName,
        username: row.userName,
        email: row.email,
        phone: row.cellphone,
        department: row.deptName,
        role: row.posCode,
        groups: [],
        permissions: [],
        status: row.status === 1 ? 'active' : 'inactive',
        errors: [],
      };
      (newUser as any).createdDate = formatDateVN(new Date());
      (newUser as any).lastLogin = 'Chưa đăng nhập';
      return [newUser, ...currentUsers];
    }
    if (st === 'upd') {
      return currentUsers.map(u =>
        u.username.toLowerCase() === row.userName.toLowerCase()
          ? { ...u, name: row.fullName, email: row.email, department: row.deptName, role: row.posCode }
          : u
      );
    }
    return currentUsers;
  };

  const approveSyncRows = (rows: SyncUser[]) => {
    const approvable = rows.filter(isApprovable);
    if (approvable.length === 0) {
      setSyncMessage('Không có dòng nào cần duyệt.');
      return;
    }
    let nextUsers = users;
    const added: string[] = [];
    const updated: string[] = [];
    approvable.forEach(row => {
      const st = getSyncStatus(row);
      nextUsers = applySyncRowToUsers(row, nextUsers);
      if (st === 'new') added.push(row.fullName);
      else if (st === 'upd') updated.push(row.fullName);
    });
    setUsers(nextUsers);
    const approvedIds = approvable.map(r => r.userId);
    setSyncUsers(prev =>
      prev.map(r => (approvedIds.includes(r.userId) ? { ...r, approvalStatus: 'approved' } : r))
    );
    setSyncSelectedIds(prev => prev.filter(id => !approvedIds.includes(id)));
    const parts: string[] = [];
    if (added.length) parts.push(`thêm mới ${added.join(', ')}`);
    if (updated.length) parts.push(`cập nhật ${updated.join(', ')}`);
    setSyncMessage(
      `Đã duyệt ${approvable.length} người${parts.length ? ': ' + parts.join('; ') : ''}. Danh sách đã cập nhật.`
    );
  };

  const departmentsList = Array.from(new Set(users.map(u => u.department).filter(Boolean)));
  const groupsList = Array.from(new Set([
    ...availableGroups.map(g => g.name),
    ...users.flatMap(u => u.groups || [])
  ].filter(Boolean)));
  const appliedTerm = normalizeSearch(applied.searchTerm);
  const filteredUsers = users.filter(user => {
    const matchesSearch = normalizeSearch(user.name).includes(appliedTerm) ||
                         normalizeSearch(user.email).includes(appliedTerm) ||
                         normalizeSearch(user.username).includes(appliedTerm);
    const matchesStatus = applied.filterStatus === 'all' || user.status === applied.filterStatus;
    const matchesDepartment = applied.filterDepartment === 'all' || user.department === applied.filterDepartment;
    const matchesGroup = applied.filterGroup === 'all' || (user.groups && user.groups.includes(applied.filterGroup));
    return matchesSearch && matchesStatus && matchesDepartment && matchesGroup;
  });

  const runSearch = () => {
    setApplied({ searchTerm, filterStatus, filterDepartment, filterGroup });
    setCurrentPage(1);
  };

  const handleOpenModal = (type: ModalType, user?: User) => {
    setModalType(type);
    if (type === 'sync') {
      // Mỗi lần Đồng bộ = gọi lại API SSO lấy danh sách mới → nạp lại staging, mọi dòng về "Chờ duyệt"
      setSyncUsers(initialSyncUsersData.map(u => ({ ...u, approvalStatus: 'pending' as const })));
      setSyncSelectedIds([]);
      setSyncMessage('');
      setSyncSearch('');
      setSyncAppliedSearch('');
      setSyncFilterStatus('all');
      setSyncFilterApproval('all');
      setSyncDetail(null);
    }
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
      } else if (type === 'assign-group') {
        const groupIds = availableGroups
          .filter(ag => user.groups.includes(ag.name))
          .map(ag => ag.id);
        setSelectedGroups(groupIds);
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
    if (prevModalType === 'detail' && selectedUser) {
      setModalType('detail');
      setPrevModalType(null);
    } else {
      setModalType(null);
      setSelectedUser(null);
      setSelectedGroups([]);
      setSelectedRole('');
      setPrevModalType(null);
      setSyncSearch('');
      setSyncAppliedSearch('');
      setSyncFilterStatus('all');
      setSyncFilterApproval('all');
      setSyncSelectedIds([]);
      setSyncMessage('');
      setSyncDetail(null);
    }
  };

  const toggleGroup = (groupId: number) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const handleSaveGroups = () => {
    if (!selectedUser) return;
    const newGroupNames = availableGroups
      .filter(g => selectedGroups.includes(g.id))
      .map(g => g.name);

    let newRole = selectedUser.role;
    if (selectedGroups.length > 0) {
      const firstGroup = availableGroups.find(g => g.id === selectedGroups[0]);
      if (firstGroup) {
        newRole = firstGroup.role;
      }
    }

    const updatedUser = { ...selectedUser, groups: newGroupNames, role: newRole };
    setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
    setSelectedUser(updatedUser);

    toast.success(`Đã cập nhật nhóm cho người dùng ${selectedUser.name} thành công!`);
    
    if (prevModalType === 'detail') {
      setModalType('detail');
      setPrevModalType(null);
    } else {
      handleCloseModal();
    }
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.department) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    if (modalType === 'add') {
      if (users.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
        toast.error('Tên đăng nhập đã tồn tại trong hệ thống!');
        return;
      }

      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        role: formData.role,
        groups: [],
        permissions: ['Xem dữ liệu'],
        status: formData.status,
        errors: []
      };
      (newUser as any).createdDate = formatDateVN(new Date());
      (newUser as any).lastLogin = 'Chưa đăng nhập';

      setUsers([newUser, ...users]);
      toast.success('Thêm người dùng mới thành công!');
    } else if (modalType === 'edit' && selectedUser) {
      setUsers(users.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            role: formData.role,
            status: formData.status
          };
        }
        return u;
      }));
      toast.success('Cập nhật thông tin người dùng thành công!');
    }
    handleCloseModal();
  };

  const handleToggleUserStatus = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
      toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'ngừng hoạt động'} tài khoản của ${selectedUser.name} thành công!`);
      handleCloseModal();
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success('Xóa người dùng thành công!');
      handleCloseModal();
    }
  };

  const handleImportUsers = (users: ImportUser[]) => {
    // Logic to import users
    console.log('Importing users:', users);
    toast.success(`Đã nhập khẩu thành công ${users.length} người dùng!`);
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
    <div className="space-y-4">
      {/* Thẻ thống kê nhỏ (compomennt.md 5.6.1) — thay StatsCard dùng chung */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-[16px] text-[#64748B]">Tổng người dùng</div>
              <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">2,847</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-[16px] text-[#64748B]">Đang hoạt động</div>
              <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">2,654</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-[16px] text-[#64748B]">Không hoạt động</div>
              <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">193</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tìm kiếm & bộ lọc (5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm người dùng"
              placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
              className={SEARCH_INPUT_CLS}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            />
            <button type="button" title="Tìm kiếm" aria-label="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Bộ lọc"
              className={filterBtnClass(showFilters)}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => handleOpenModal('sync')} className={BTN_OUTLINE}>
              <RefreshCw className="w-4 h-4" />
              Đồng bộ
            </button>
            <button type="button" onClick={() => handleOpenModal('export')} className={BTN_OUTLINE}>
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                title="Lọc theo trạng thái"
                aria-label="Lọc theo trạng thái"
                className={INPUT_CLS}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Đơn vị</label>
              <select
                aria-label="Lọc theo đơn vị"
                className={INPUT_CLS}
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">Tất cả đơn vị</option>
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Nhóm người dùng</label>
              <select
                aria-label="Lọc theo nhóm người dùng"
                className={INPUT_CLS}
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
              >
                <option value="all">Tất cả nhóm</option>
                {groupsList.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bảng người dùng (5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Họ tên</th>
                <th className={`${TH} text-left`}>Tên đăng nhập</th>
                <th className={`${TH} text-left`}>Email</th>
                <th className={`${TH} text-left`}>Đơn vị</th>
                <th className={`${TH} text-left`}>Vai trò</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-left`}>Đăng nhập gần nhất</th>
                <th className={`${TH} text-center w-24 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : filteredUsers
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((user, index) => {
                  const login = splitDateTime(getLastLogin(user));
                  return (
                  <tr key={user.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center whitespace-nowrap`}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td className={`${TD} text-left max-w-[240px]`}>
                      <TruncatedText text={user.name} />
                    </td>
                    <td className={`${TD} text-left max-w-[200px]`}>
                      <TruncatedText text={user.username} />
                    </td>
                    <td className={`${TD} text-left max-w-[260px]`}>
                      <TruncatedText text={user.email} />
                    </td>
                    <td className={`${TD} text-left max-w-[220px]`}>
                      <TruncatedText text={user.department || '-'} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      {user.role ? (
                        <button
                          type="button"
                          onClick={() => { setSelectedUser(user); setSelectedRole(user.role); handleOpenModal('assign-role', user); }}
                          className="inline-flex rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          title="Đổi vai trò"
                          aria-label={`Đổi vai trò: ${user.role}`}
                        >
                          <Badge label={user.role} variant="blue" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setSelectedUser(user); setSelectedRole(''); handleOpenModal('assign-role', user); }}
                          className={`${BTN_OUTLINE} !h-8 !px-3 whitespace-nowrap`}
                        >
                          Chọn vai trò
                        </button>
                      )}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      <Badge
                        label={user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        variant={user.status === 'active' ? 'green' : 'slate'}
                      />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                      <div>{login.date}</div>
                      {login.time && <div className="text-[#64748B]">{login.time}</div>}
                    </td>
                    <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction label="Xem chi tiết" onClick={() => handleOpenModal('detail', user)}>
                          <Eye className="w-4 h-4" />
                        </RowIconAction>
                        <RowIconAction
                          label={user.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
                          onClick={() => handleOpenModal(user.status === 'active' ? 'lock' : 'unlock', user)}
                        >
                          {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Phân trang (5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Modals */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="user-form-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="user-form-title" className={MODAL_TITLE}>{modalType === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h3>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Họ và tên <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Tên đăng nhập <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập tên đăng nhập"
                    disabled={modalType === 'edit'}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Email <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="email@moj.gov.vn"
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="0912345678"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={LABEL_CLS}>Đơn vị <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Đơn vị"
                    aria-label="Đơn vị"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={INPUT_CLS}
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
                  <label className={LABEL_CLS}>Vai trò <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Vai trò"
                    aria-label="Vai trò"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Biên tập viên">Biên tập viên</option>
                    <option value="Người xem">Người xem</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Trạng thái</label>
                  <select
                    title="Trạng thái"
                    aria-label="Trạng thái"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={INPUT_CLS}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseModal} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button type="button" onClick={handleSaveUser} className={BTN_PRIMARY}>
                {modalType === 'add' ? 'Thêm người dùng' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal — Xem chi tiết: chiều cao cố định, thân tự cuộn (5.4) */}
      {modalType === 'detail' && selectedUser && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="user-detail-title" className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="user-detail-title" className={MODAL_TITLE}>Chi tiết người dùng</h3>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {/* Basic Info */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Họ và tên</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedUser.name || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Tên đăng nhập</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedUser.username || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Email</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedUser.email || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số điện thoại</div>
                    <div className={FIELD_VALUE}>{selectedUser.phone || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Đơn vị</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedUser.department || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Vai trò</div>
                    {selectedUser.role ? <Badge label={selectedUser.role} variant="blue" /> : <div className={FIELD_VALUE}>-</div>}
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái</div>
                    <Badge
                      label={selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      variant={selectedUser.status === 'active' ? 'green' : 'slate'}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Đăng nhập gần nhất</div>
                    <div className={FIELD_VALUE}>{(() => { const l = splitDateTime(getLastLogin(selectedUser)); return l.time ? `${l.date} ${l.time}` : l.date; })()}</div>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h4 className={`${SECTION_TITLE} !mb-0`}>
                    <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                    Nhóm người dùng ({selectedUser.groups.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setPrevModalType('detail');
                      handleOpenModal('assign-group', selectedUser);
                    }}
                    className={BTN_PRIMARY}
                  >
                    <Plus className="w-4 h-4" />
                    Thêm nhóm người dùng
                  </button>
                </div>
                {selectedUser.groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.groups.map((group, index) => (
                      <Badge key={index} label={group} variant="purple" />
                    ))}
                  </div>
                ) : (
                  <div className="text-[13px] text-[#64748B]">Chưa tham gia nhóm nào.</div>
                )}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseModal} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Group Modal */}
      {modalType === 'assign-group' && selectedUser && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="assign-group-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
              <div>
                <h3 id="assign-group-title" className={MODAL_TITLE}>Gán nhóm người dùng</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">Người dùng: {selectedUser.name}</p>
              </div>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="space-y-2">
                {availableGroups.map(group => (
                  <label
                    key={group.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedGroups.includes(group.id) ? 'border-[#BFDBFE] bg-[#EAF3FF]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#020817]">{group.name}</div>
                      <div className="text-[12px] text-[#64748B]">Mã: {group.code}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseModal} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button type="button" onClick={handleSaveGroups} className={BTN_PRIMARY}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation — hộp thoại xác nhận dùng chung (5.4) */}
      <ConfirmModal
        isOpen={modalType === 'delete' && !!selectedUser}
        onClose={handleCloseModal}
        onConfirm={handleDeleteUser}
        type="delete"
        title="Xác nhận xóa người dùng"
        subtitle="Lưu ý: Hành động này không thể hoàn tác!"
        message={<>Bạn có chắc chắn muốn xóa người dùng <span className="font-medium">{selectedUser?.name}</span>?</>}
        confirmText="Xóa người dùng"
        cancelText="Hủy"
      />

      {/* Lock/Unlock Confirmation — hộp thoại xác nhận dùng chung (5.4) */}
      <ConfirmModal
        isOpen={(modalType === 'lock' || modalType === 'unlock') && !!selectedUser}
        onClose={handleCloseModal}
        onConfirm={handleToggleUserStatus}
        type={modalType === 'lock' ? 'warning' : 'success'}
        title={modalType === 'lock' ? 'Xác nhận ngừng hoạt động tài khoản' : 'Xác nhận kích hoạt tài khoản'}
        subtitle=""
        message={<>Bạn có chắc chắn muốn {modalType === 'lock' ? 'ngừng hoạt động' : 'kích hoạt'} tài khoản của{' '}<span className="font-medium">{selectedUser?.name}</span>?</>}
        confirmText={modalType === 'lock' ? 'Ngừng hoạt động' : 'Kích hoạt'}
        cancelText="Hủy"
      />

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
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="user-export-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="user-export-title" className={MODAL_TITLE}>Xuất khẩu người dùng</h3>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-3 text-[13px] text-[#020817]">
              <p>
                Bạn có thể xuất khẩu danh sách người dùng ra file Excel. File Excel sẽ chứa các cột sau:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Họ và tên</li>
                <li>Tên đăng nhập</li>
                <li>Email</li>
                <li>Số điện thoại</li>
                <li>Đơn vị</li>
                <li>Vai trò</li>
                <li>Trạng thái (active, inactive, locked)</li>
              </ul>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" className={BTN_PRIMARY} onClick={handleExportUsers}>
                <Download className="w-4 h-4" />
                Xuất khẩu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Users Modal — Đồng bộ người dùng có bước duyệt (chiều cao cố định, header/footer không trôi) */}
      {modalType === 'sync' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="user-sync-title" className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
              <div>
                <h3 id="user-sync-title" className={MODAL_TITLE}>Đồng bộ người dùng từ nguồn</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">Trạng thái = so sánh với danh sách người dùng thật (khớp theo Tên đăng nhập)</p>
              </div>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {/* Thanh tìm kiếm (áp dụng khi bấm Tìm kiếm / Enter) + hành động bên phải */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-1.5">
                  <input
                    type="text"
                    aria-label="Tìm kiếm người dùng đồng bộ"
                    placeholder="Tìm kiếm theo họ tên, tên đăng nhập, email..."
                    className={SEARCH_INPUT_CLS}
                    value={syncSearch}
                    onChange={(e) => setSyncSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSyncAppliedSearch(syncSearch); }}
                  />
                  <button type="button" title="Tìm kiếm" aria-label="Tìm kiếm" onClick={() => setSyncAppliedSearch(syncSearch)} className={SEARCH_BTN_CLS}>
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => approveSyncRows(syncUsers.filter(r => syncSelectedIds.includes(r.userId)))}
                    disabled={syncSelectedIds.length === 0}
                    className={`${BTN_PRIMARY} whitespace-nowrap`}
                  >
                    Duyệt ({syncSelectedIds.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => approveSyncRows(syncUsers)}
                    className={`${BTN_OUTLINE} whitespace-nowrap`}
                  >
                    Duyệt tất cả
                  </button>
                </div>
              </div>

              {/* Bộ lọc nhanh (áp dụng ngay khi chọn) */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  title="Trạng thái đồng bộ"
                  aria-label="Trạng thái đồng bộ"
                  className={`${INPUT_CLS} !w-[260px]`}
                  value={syncFilterStatus}
                  onChange={(e) => setSyncFilterStatus(e.target.value as 'all' | SyncStatus)}
                >
                  <option value="all">Trạng thái đồng bộ: Tất cả</option>
                  <option value="new">Thêm mới</option>
                  <option value="upd">Cập nhật</option>
                  <option value="same">Không thay đổi</option>
                  <option value="err">Lỗi</option>
                </select>
                <select
                  title="Trạng thái duyệt"
                  aria-label="Trạng thái duyệt"
                  className={`${INPUT_CLS} !w-[260px]`}
                  value={syncFilterApproval}
                  onChange={(e) => setSyncFilterApproval(e.target.value as 'all' | 'pending' | 'approved')}
                >
                  <option value="all">Trạng thái duyệt: Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                </select>
              </div>

              {/* Thông báo sau duyệt */}
              {syncMessage && (
                <div className="flex items-start gap-2 px-4 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[13px] text-[#020817]">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#16A34A]" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* Bảng dữ liệu kéo về */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={`${TH} text-center w-10`}>
                          {(() => {
                            const approvableRows = filteredSyncUsers.filter(isApprovable);
                            const allSel = approvableRows.length > 0 && approvableRows.every(r => syncSelectedIds.includes(r.userId));
                            return (
                              <input
                                type="checkbox"
                                checked={allSel}
                                disabled={approvableRows.length === 0}
                                onChange={(e) => setSyncSelectedIds(e.target.checked ? approvableRows.map(r => r.userId) : [])}
                                title="Chọn tất cả"
                                aria-label="Chọn tất cả"
                                className="w-4 h-4 align-middle accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                              />
                            );
                          })()}
                        </th>
                        <th className={`${TH} text-center w-12`}>STT</th>
                        <th className={`${TH} text-left`}>Họ tên</th>
                        <th className={`${TH} text-left`}>Tên đăng nhập</th>
                        <th className={`${TH} text-left`}>Email</th>
                        <th className={`${TH} text-left`}>Đơn vị</th>
                        <th className={`${TH} text-left`}>Chức vụ</th>
                        <th className={`${TH} text-left`}>Trạng thái đồng bộ</th>
                        <th className={`${TH} text-left`}>Trạng thái duyệt</th>
                        <th className={`${TH} text-left`}>Cập nhật lần cuối</th>
                        <th className={`${TH} text-center w-20 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSyncUsers.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="py-16 text-center text-[13px] text-[#64748B]">
                            Không có dữ liệu phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredSyncUsers.map((row, index) => {
                          const st = getSyncStatus(row);
                          const approvable = isApprovable(row);
                          const checkboxTitle = st === 'err'
                            ? 'Không thể duyệt: thiếu thông tin bắt buộc (email)'
                            : (st === 'same' ? 'Không cần duyệt' : (row.approvalStatus === 'approved' ? 'Đã duyệt' : 'Chọn để duyệt'));
                          const rowBg = st === 'err' ? 'bg-[#FEF2F2]' : 'bg-white group-hover:bg-[#F8FAFC]';
                          const updated = splitDateTime(row.update_date);
                          return (
                            <tr
                              key={row.userId}
                              className={`group h-12 border-b border-[#E0E0E0] transition-colors ${st === 'err' ? 'bg-[#FEF2F2]' : 'bg-white hover:bg-[#F8FAFC]'}`}
                            >
                              <td className={`${TD} text-center`}>
                                <input
                                  type="checkbox"
                                  checked={syncSelectedIds.includes(row.userId)}
                                  disabled={!approvable}
                                  onChange={() => toggleSyncSelect(row)}
                                  title={checkboxTitle}
                                  aria-label={checkboxTitle}
                                  className="w-4 h-4 align-middle accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className={`${TD} text-center whitespace-nowrap`}>{index + 1}</td>
                              <td className={`${TD} text-left max-w-[220px]`}>
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {st === 'err' && <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />}
                                  <TruncatedText text={row.fullName} className="min-w-0" />
                                </div>
                              </td>
                              <td className={`${TD} text-left max-w-[180px]`}>
                                <TruncatedText text={row.userName} />
                              </td>
                              <td className={`${TD} text-left max-w-[240px]`}>
                                {row.email ? <TruncatedText text={row.email} /> : <span className="text-[#DC2626] whitespace-nowrap">(thiếu email)</span>}
                              </td>
                              <td className={`${TD} text-left max-w-[200px]`}>
                                <TruncatedText text={row.deptName} />
                              </td>
                              <td className={`${TD} text-left max-w-[160px]`}>
                                <TruncatedText text={row.posCode} />
                              </td>
                              <td className={`${TD} text-left whitespace-nowrap`}>
                                <Badge label={syncStatusLabel[st]} variant={syncStatusBadge[st]} />
                              </td>
                              <td className={`${TD} text-left whitespace-nowrap`}>
                                <Badge
                                  label={row.approvalStatus === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                                  variant={row.approvalStatus === 'approved' ? 'green' : 'amber'}
                                />
                              </td>
                              <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                                <div>{updated.date}</div>
                                {updated.time && <div className="text-[#64748B]">{updated.time}</div>}
                              </td>
                              <td className={`${TD} text-center sticky right-0 transition-colors shadow-[-1px_0_0_#E2E8F0] ${rowBg}`}>
                                <div className="inline-flex items-center justify-center gap-1">
                                  <RowIconAction label="Xem chi tiết" onClick={() => setSyncDetail(row)}>
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseModal} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>

          {/* Popup chi tiết 1 dòng kéo về (read-only) */}
          {syncDetail && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000] p-4" onClick={(e) => { e.stopPropagation(); setSyncDetail(null); }}>
              <div role="dialog" aria-modal="true" aria-labelledby="sync-detail-title" className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
                  <h3 id="sync-detail-title" className={MODAL_TITLE}>Chi tiết người dùng đồng bộ</h3>
                  <button type="button" onClick={() => setSyncDetail(null)} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-4 content-start">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Họ và tên</div>
                    <div className={`${FIELD_VALUE} break-words`}>{syncDetail.fullName || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Tên đăng nhập</div>
                    <div className={`${FIELD_VALUE} break-words`}>{syncDetail.userName || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Email</div>
                    <div className={`${FIELD_VALUE} break-words`}>{syncDetail.email || '(trống)'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số điện thoại</div>
                    <div className={FIELD_VALUE}>{syncDetail.cellphone || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>CMND/CCCD</div>
                    <div className={FIELD_VALUE}>{syncDetail.identityCard || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>User ID</div>
                    <div className={FIELD_VALUE}>{syncDetail.userId}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Mã đơn vị</div>
                    <div className={FIELD_VALUE}>{syncDetail.deptCode || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Đơn vị</div>
                    <div className={`${FIELD_VALUE} break-words`}>{syncDetail.deptName || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Chức vụ</div>
                    <div className={FIELD_VALUE}>{syncDetail.posCode || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái (status)</div>
                    <div className={FIELD_VALUE}>{syncDetail.status}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Cập nhật lần cuối</div>
                    <div className={FIELD_VALUE}>{syncDetail.update_date || '-'}</div>
                  </div>
                </div>
                <div className={MODAL_FOOTER}>
                  <button type="button" onClick={() => setSyncDetail(null)} className={BTN_OUTLINE}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assign Role Modal */}
      {modalType === 'assign-role' && selectedUser && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="assign-role-title" className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
              <div>
                <h3 id="assign-role-title" className={MODAL_TITLE}>Gán vai trò</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">Người dùng: <span className="font-medium text-[#020817]">{selectedUser.name}</span></p>
              </div>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="space-y-2">
                {availableRoles.map(role => (
                  <label key={role} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedRole === role ? 'border-[#BFDBFE] bg-[#EAF3FF]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}>
                    <input
                      type="radio"
                      name="role-selection"
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[13px] text-[#020817]">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseModal} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedUsers = users.map(u =>
                    u.id === selectedUser.id ? { ...u, role: selectedRole } : u
                  );
                  setUsers(updatedUsers);
                  handleCloseModal();
                }}
                className={BTN_PRIMARY}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}