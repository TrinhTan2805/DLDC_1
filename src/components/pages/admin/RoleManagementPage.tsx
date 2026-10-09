import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, User, Users, CheckCircle, ArrowRight, X, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { menuStructure } from './menuStructure';
import { Badge, RowIconAction, TOOLTIP_CLS, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, BTN_FOCUS, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, GROUP_TITLE, tabClass, formatDateVN, normalizeSearch } from '../collection/collectionUi';

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

// --- Lớp giao diện theo compomennt.md ---
// Modal (5.4): nền mờ 50%, khung bo 16px, header 16px/500 + nút X, chân nền #F8FAFC nút căn phải
const MODAL_OVERLAY = 'fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4';
const MODAL_HEADER = 'shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const MODAL_SUBTITLE = 'text-[13px] text-[#64748B]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3';
// Checkbox (5.12): màu primary
const CHECKBOX_CLS = 'w-4 h-4 shrink-0 accent-blue-600 cursor-pointer';
// Danh sách chọn trong modal
const PICK_LIST_CLS = 'border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0]';
const PICK_ITEM_CLS = 'flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors';

export function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  // Tìm kiếm & bộ lọc chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState<{ searchTerm: string; statusFilter: 'all' | 'active' | 'inactive' }>({ searchTerm: '', statusFilter: 'all' });
  const [showFilters, setShowFilters] = useState(false);
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
    const matchesSearch = normalizeSearch(role.name).includes(normalizeSearch(applied.searchTerm));
    const matchesStatus = applied.statusFilter === 'all' || role.status === applied.statusFilter;
    return matchesSearch && matchesStatus;
  });

  const runSearch = () => {
    setApplied({ searchTerm, statusFilter });
  };

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
      toast.error('Ràng buộc tính hợp lệ: Tên vai trò không được để trống!');
      return;
    }

    const isDuplicate = roles.some(r =>
      r.name.toLowerCase().trim() === formData.name.toLowerCase().trim() &&
      (modalType === 'add' || r.id !== selectedRole?.id)
    );

    if (isDuplicate) {
      toast.error('Ràng buộc tính hợp lệ: Tên vai trò đã tồn tại trong hệ thống! Vui lòng chọn tên khác.');
      return;
    }

    if (modalType === 'add') {
      const today = formatDateVN(new Date());
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
      toast.success(`Ghi nhận vai trò mới "${formData.name}" thành công!`);
    } else if (modalType === 'edit' && selectedRole) {
      setRoles(roles.map(r => {
        if (r.id === selectedRole.id) {
          const currentVer = parseFloat(r.version?.replace('v', '') || '1.0');
          const nextVer = `v${(currentVer + 0.1).toFixed(1)}`;
          const today = formatDateVN(new Date());

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
      toast.success(`Đã ghi nhận phiên bản chỉnh sửa mới cho vai trò "${formData.name}"!`);
    }
    handleCloseModal();
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      if (selectedRole.memberCount > 0 || selectedRole.groupCount > 0) {
        toast.error('Ràng buộc hệ thống: Không thể xóa vai trò đã được gán cho người dùng hoặc nhóm người dùng!');
        return;
      }
      setRoles(roles.filter(r => r.id !== selectedRole.id));
      toast.success(`Đã xóa vai trò "${selectedRole.name}" thành công! Hệ thống đã ghi nhận nhật ký hành động xóa vai trò vào Nhật ký hệ thống.`);
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

  // Thẻ thống kê nhỏ (mục 5.6.1) — thay StatsCard dùng chung
  const statCards = [
    { icon: Shield, tone: 'bg-blue-50 text-blue-600', title: 'Tổng số vai trò', value: roles.length.toString() },
    { icon: Shield, tone: 'bg-green-50 text-green-600', title: 'Vai trò hoạt động', value: roles.filter(r => r.status === 'active').length.toString() },
    { icon: User, tone: 'bg-purple-50 text-purple-600', title: 'Số người dùng được gán vai trò', value: roles.reduce((acc, r) => acc + r.memberCount, 0).toString() },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, tone, title, value }) => (
          <div key={title} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${tone.split(' ')[0]}`}>
                <Icon className={`w-5 h-5 ${tone.split(' ')[1]}`} />
              </div>
              <div>
                <div className="text-[16px] text-[#64748B]">{title}</div>
                <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thanh tìm kiếm & bộ lọc (mục 5.19) */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm vai trò"
              placeholder="Tìm kiếm theo tên vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              className={SEARCH_INPUT_CLS}
            />
            <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Bộ lọc"
              title="Bộ lọc"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className={filterBtnClass(showFilters)}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenModal('add')}
              className={BTN_PRIMARY}
            >
              <Plus className="w-4 h-4" />
              Tạo vai trò
            </button>
          </div>
        </div>

        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                aria-label="Lọc trạng thái"
                title="Lọc trạng thái"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#CBD5E1] transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3 className={GROUP_TITLE}>{role.name}</h3>
                  <Badge label={role.roleType} variant="blue" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleOpenModal('history', role)}
                        aria-label="Xem chi tiết lịch sử phiên bản"
                        className={`inline-flex items-center h-[26px] px-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#475569] hover:bg-[#EAF3FF] hover:border-[#BFDBFE] hover:text-blue-600 transition-colors ${BTN_FOCUS}`}
                      >
                        {role.version || 'v1.0'}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Xem chi tiết lịch sử phiên bản</TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[13px] text-[#020817] mb-1">{role.description}</p>
                {role.updatedDate && (
                  <p className="text-[12px] text-[#64748B]">
                    Ghi nhận cập nhật: {role.updatedDate}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <RowIconAction label="Chỉnh sửa" onClick={() => handleOpenModal('edit', role)}>
                  <Edit className="w-4 h-4" />
                </RowIconAction>
                <RowIconAction label="Xóa" onClick={() => handleOpenModal('delete', role)}>
                  <Trash2 className="w-4 h-4" />
                </RowIconAction>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#E2E8F0]">
              <div>
                <div className="text-[12px] text-[#64748B] mb-1">Người dùng</div>
                <div className="text-[13px] font-medium text-[#0F172A] tabular-nums">{role.memberCount}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B] mb-1">Nhóm ND</div>
                <div className="text-[13px] font-medium text-[#0F172A] tabular-nums">{role.groupCount || 0}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B] mb-1">Quyền CN</div>
                <div className="text-[13px] font-medium text-[#0F172A] tabular-nums">{role.permissions.length}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B] mb-1">Trạng thái</div>
                <Badge
                  label={role.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  variant={role.status === 'active' ? 'green' : 'slate'}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="role-form-modal-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={MODAL_HEADER}>
              <h3 id="role-form-modal-title" className={MODAL_TITLE}>
                {modalType === 'add' ? 'Tạo vai trò mới' : `Chỉnh sửa vai trò (Phiên bản ${selectedRole?.version})`}
              </h3>
              <button type="button" aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>
                    Tên vai trò <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Tên vai trò"
                    title="Tên vai trò"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập tên vai trò..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLS}>Chọn đơn vị</label>
                    <select
                      title="Chọn đơn vị"
                      aria-label="Chọn đơn vị"
                      className={INPUT_CLS}
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
                    <label className={LABEL_CLS}>Chọn Quản lý đơn vị</label>
                    <div className="relative">
                      <input
                        type="text"
                        aria-label="Chọn Quản lý đơn vị"
                        className={`${INPUT_CLS} pr-16`}
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
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {formData.unitAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, unitAdmin: '' });
                              setUserDropdownSearch('');
                            }}
                            className={`p-0.5 rounded text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] ${BTN_FOCUS}`}
                            title="Xóa lựa chọn"
                            aria-label="Xóa lựa chọn"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Mở danh sách"
                          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                          className={`p-0.5 rounded text-[#475569] hover:text-[#020817] ${BTN_FOCUS}`}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {userDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 py-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                        {availableUsers
                          .filter(u => !formData.selectedUnit || u.department === formData.selectedUnit)
                          .filter(u =>
                            u.name.toLowerCase().includes(userDropdownSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userDropdownSearch.toLowerCase())
                          )
                          .map(u => (
                            <div
                              key={u.id}
                              className={`px-3 py-2 cursor-pointer flex flex-col ${formData.unitAdmin === u.id.toString() ? 'bg-[#EAF3FF]' : 'hover:bg-[#F1F5F9]'}`}
                              onClick={() => {
                                setFormData({ ...formData, unitAdmin: u.id.toString(), selectedUnit: u.department });
                                setUserDropdownOpen(false);
                                setUserDropdownSearch(u.name);
                              }}
                            >
                              <span className={`text-[13px] ${formData.unitAdmin === u.id.toString() ? 'text-blue-600 font-medium' : 'text-[#020817]'}`}>{u.name}</span>
                              <span className="text-[12px] text-[#64748B]">{u.email} • {u.department}</span>
                            </div>
                          ))}
                        {availableUsers
                          .filter(u => !formData.selectedUnit || u.department === formData.selectedUnit)
                          .filter(u =>
                            u.name.toLowerCase().includes(userDropdownSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userDropdownSearch.toLowerCase())
                          ).length === 0 && (
                          <div className="px-3 py-3 text-[13px] text-[#64748B] text-center">Không tìm thấy người dùng</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`${LABEL_CLS} mb-2`}>Phân quyền module chức năng</label>

                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
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
                            <div key={item.id} className={depth === 0 ? "mb-3 break-inside-avoid" : "mt-1"}>
                              <div className="flex items-center gap-1">
                                {hasChildren ? (
                                  <button
                                    type="button"
                                    onClick={toggleExpand}
                                    className={`p-1 rounded text-[#475569] hover:bg-[#E2E8F0] hover:text-[#020817] shrink-0 flex items-center justify-center ${BTN_FOCUS}`}
                                    title={isExpanded ? "Thu gọn" : "Mở rộng"}
                                    aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-6 shrink-0" />
                                )}
                                <label className="flex items-start gap-2 cursor-pointer py-1">
                                  <input
                                    type="checkbox"
                                    className={`${CHECKBOX_CLS} mt-0.5`}
                                    checked={isSelected}
                                    onChange={toggleSelection}
                                  />
                                  <span className={depth === 0 ? GROUP_TITLE : "text-[13px] text-[#020817]"}>{item.name}</span>
                                </label>
                              </div>
                              {hasChildren && isExpanded && (
                                <div className="ml-6 border-l border-[#E2E8F0] pl-4 mt-1">
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
                  <label className={LABEL_CLS}>
                    Trạng thái
                  </label>
                  <select
                    aria-label="Trạng thái"
                    title="Trạng thái"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={handleCloseModal}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className={BTN_PRIMARY}
                disabled={!formData.name.trim()}
              >
                {modalType === 'add' ? 'Lưu vai trò' : 'Ghi nhận chỉnh sửa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal — modal nhỏ theo 5.4 (giữ nút xóa bị khóa khi còn ràng buộc) */}
      {modalType === 'delete' && selectedRole && (
        <div className={MODAL_OVERLAY}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="role-delete-modal-title" className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FEF2F2] text-[#DC2626]">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 id="role-delete-modal-title" className={`${MODAL_TITLE} flex-1 min-w-0 pt-2 leading-6`}>Xác nhận xóa vai trò</h3>
              <button type="button" aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 text-[13px] text-[#020817] leading-5">
              Bạn có chắc chắn muốn xóa vai trò <span className="font-medium">"{selectedRole.name}"</span> không?
              {(selectedRole.memberCount > 0 || selectedRole.groupCount > 0) && (
                <div className="mt-3 text-[13px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FEE2E2] p-3 rounded-lg text-left">
                  <span className="font-medium block mb-1">Cảnh báo ràng buộc: Không thể xóa vì:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRole.memberCount > 0 && <li>Đang được gán cho {selectedRole.memberCount} người dùng.</li>}
                    {selectedRole.groupCount > 0 && <li>Đang được gán cho {selectedRole.groupCount} nhóm người dùng.</li>}
                  </ul>
                </div>
              )}
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={handleCloseModal}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteRole}
                disabled={selectedRole.memberCount > 0 || selectedRole.groupCount > 0}
                className={BTN_DESTRUCTIVE}
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Users/Groups Modal — modal nhiều tab: chiều cao cố định (5.4) */}
      {modalType === 'assign-users' && selectedRole && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="role-assign-modal-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={MODAL_HEADER}>
              <div className="min-w-0">
                <h3 id="role-assign-modal-title" className={MODAL_TITLE}>Gán vai trò cho người dùng/nhóm</h3>
                <p className={MODAL_SUBTITLE}>Vai trò gán: {selectedRole.name}</p>
              </div>
              <button type="button" aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Header */}
            <div className="shrink-0 px-6 border-b border-[#E2E8F0] flex">
              <button
                type="button"
                onClick={() => setAssignTab('users')}
                className={tabClass(assignTab === 'users')}
              >
                <User className="w-4 h-4" />
                Người dùng
              </button>
              <button
                type="button"
                onClick={() => setAssignTab('groups')}
                className={tabClass(assignTab === 'groups')}
              >
                <Users className="w-4 h-4" />
                Nhóm người dùng
              </button>
            </div>

            <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto custom-scrollbar">
              {assignTab === 'users' ? (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      aria-label="Tìm kiếm người dùng"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm người dùng..."
                      className={`${INPUT_CLS} mb-3`}
                    />
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <input
                        type="checkbox"
                        checked={showUnassignedOnly}
                        onChange={(e) => setShowUnassignedOnly(e.target.checked)}
                        className={CHECKBOX_CLS}
                      />
                      <span className="text-[13px] text-[#020817]">Chỉ hiển thị người dùng chưa được gán vai trò nào</span>
                    </label>
                  </div>

                  <div className={PICK_LIST_CLS}>
                    {availableUsers
                      .filter(user => user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
                      .filter(user => !showUnassignedOnly || (!allAssignedUserIds.has(user.id) || selectedUsers.includes(user.id)))
                      .map(user => (
                        <label key={user.id} className={PICK_ITEM_CLS}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className={CHECKBOX_CLS}
                          />
                          <div className="min-w-0">
                            <div className="text-[13px] text-[#020817]">{user.name}</div>
                            <div className="text-[12px] text-[#64748B]">{user.email} • {user.department}</div>
                          </div>
                        </label>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      aria-label="Tìm kiếm nhóm người dùng"
                      value={groupSearchTerm}
                      onChange={(e) => setGroupSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm nhóm người dùng..."
                      className={INPUT_CLS}
                    />
                  </div>

                  <div className={PICK_LIST_CLS}>
                    {availableGroups
                      .filter(group => group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) || group.code.toLowerCase().includes(groupSearchTerm.toLowerCase()))
                      .map(group => (
                        <label key={group.id} className={PICK_ITEM_CLS}>
                          <input
                            type="checkbox"
                            checked={selectedGroups.includes(group.id)}
                            onChange={() => toggleGroup(group.id)}
                            className={CHECKBOX_CLS}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <span className="text-[13px] text-[#020817]">{group.name}</span>
                              <Badge label={group.code} variant="blue" />
                            </div>
                            <div className="text-[12px] text-[#64748B]">{group.department} • {group.memberCount} thành viên</div>
                          </div>
                        </label>
                      ))}
                  </div>
                </>
              )}
            </div>

            <div className={`${MODAL_FOOTER} !justify-between items-center`}>
              <div className="text-[13px] text-[#64748B]">
                {assignTab === 'users' ? (
                  <>Đã chọn <span className="font-medium text-[#020817] tabular-nums">{selectedUsers.length}</span> người dùng</>
                ) : (
                  <>Đã chọn <span className="font-medium text-[#020817] tabular-nums">{selectedGroups.length}</span> nhóm</>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={BTN_OUTLINE}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAssignUsers}
                  className={BTN_PRIMARY}
                >
                  Ghi nhận mối quan hệ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal — modal xem chi tiết: chiều cao cố định (5.4) */}
      {modalType === 'history' && selectedRole && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="role-history-modal-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={MODAL_HEADER}>
              <div className="min-w-0">
                <h3 id="role-history-modal-title" className={MODAL_TITLE}>Lịch sử phiên bản</h3>
                <p className={MODAL_SUBTITLE}>Vai trò: {selectedRole.name}</p>
              </div>
              <button type="button" aria-label="Đóng" title="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#E2E8F0]">
                {(selectedRole.history || [{version: selectedRole.version, updatedDate: selectedRole.updatedDate || selectedRole.createdDate, updatedBy: 'Hệ thống', changes: 'Khởi tạo ban đầu'}]).map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shrink-0 z-10 ${index === 0 ? 'bg-blue-600 text-white' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                      <span className="text-[12px] font-medium">{item.version}</span>
                    </div>
                    <div className="flex-1 min-w-0 bg-white p-4 rounded-lg border border-[#E2E8F0]">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="text-[13px] font-medium text-[#020817]">{item.changes}</div>
                        <div className="shrink-0 text-[12px] text-[#64748B] tabular-nums">{item.updatedDate}</div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
                           <User className="w-3 h-3" />
                        </div>
                        <span className="text-[12px] text-[#475569]">{item.updatedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={handleCloseModal}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Success Dialog — modal nhỏ (5.4) */}
      {assignmentSuccess && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="role-assign-success-title" className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 id="role-assign-success-title" className={`${MODAL_TITLE} mb-2`}>Gán vai trò thành công!</h3>
              <p className="text-[13px] text-[#64748B] mb-4">
                Hệ thống đã cập nhật quan hệ giữa vai trò <span className="font-medium text-blue-600">"{assignmentSuccess.roleName}"</span> và các đối tượng.
              </p>

              <div className="bg-[#F8FAFC] rounded-lg p-4 text-left border border-[#E2E8F0] max-h-60 overflow-y-auto custom-scrollbar space-y-3">
                {assignmentSuccess.users.length > 0 && (
                  <div>
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1">Cán bộ được gán ({assignmentSuccess.users.length})</span>
                    <ul className="text-[13px] text-[#020817] space-y-1 list-disc list-inside pl-1">
                      {assignmentSuccess.users.map(name => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {assignmentSuccess.groups.length > 0 && (
                  <div>
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1">Nhóm người dùng được gán ({assignmentSuccess.groups.length})</span>
                    <ul className="text-[13px] text-[#020817] space-y-1 list-disc list-inside pl-1">
                      {assignmentSuccess.groups.map(name => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {assignmentSuccess.users.length === 0 && assignmentSuccess.groups.length === 0 && (
                  <p className="text-[13px] text-[#64748B] text-center py-2">Đã thu hồi tất cả liên kết với vai trò này.</p>
                )}
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setAssignmentSuccess(null)}
                className={`${BTN_PRIMARY} w-full`}
              >
                <span>Xác nhận hoàn tất</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
