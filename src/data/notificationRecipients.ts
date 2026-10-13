// Dữ liệu mock cho chọn "Đối tượng nhận" ở màn Quản lý thông báo hệ thống (Quản trị & vận hành).
// Nhóm người dùng luôn thuộc 1 vai trò: chọn vai trò trước, sau đó chọn nhóm theo vai trò.
// Tên vai trò / nhóm giữ khớp với admin/UserManagementPage.tsx (availableRoles, availableGroups).
import { CURRENT_USER } from '../components/user/currentUser';

export interface RecipientGroup {
  id: number;
  name: string;
  code: string;
  role: string;
}

export interface RecipientUser {
  username: string;
  name: string;
  groups: string[];
}

export type NotificationAudience =
  | { mode: 'all' }
  | { mode: 'groups'; roles: string[]; groups: string[] }
  | { mode: 'users'; users: string[] }; // danh sách username

// 3 vai trò cuối CHƯA có nhóm người dùng nào — dùng để demo trường hợp rỗng
export const RECIPIENT_ROLES = [
  'Quản trị hệ thống',
  'Quản trị nghiệp vụ',
  'Người dùng cơ bản',
  'Quản trị viên',
  'Biên tập viên',
  'Người xem',
];

export const RECIPIENT_GROUPS: RecipientGroup[] = [
  { id: 1, name: 'Quản trị hệ thống', code: 'QTHT', role: 'Quản trị hệ thống' },
  { id: 2, name: 'Lãnh đạo Bộ phận quản trị', code: 'LDBPQT', role: 'Quản trị nghiệp vụ' },
  { id: 3, name: 'Cán bộ nghiệp vụ Hộ tịch điện tử', code: 'HTDT', role: 'Người dùng cơ bản' },
  { id: 4, name: 'Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch', code: 'HSQT', role: 'Người dùng cơ bản' },
  { id: 5, name: 'Cán bộ nghiệp vụ thi hành án dân sự', code: 'THADS', role: 'Người dùng cơ bản' },
  { id: 6, name: 'Cán bộ nghiệp vụ CSDL quốc gia về pháp luật', code: 'CSDLPL', role: 'Người dùng cơ bản' },
  { id: 7, name: 'Lãnh đạo nghiệp vụ Hộ tịch điện tử', code: 'LDHTDT', role: 'Quản trị nghiệp vụ' },
  { id: 8, name: 'Lãnh đạo nghiệp vụ quản lý hồ sơ quốc tịch', code: 'LDHSQT', role: 'Quản trị nghiệp vụ' },
];

// Người dùng đang đăng nhập đứng đầu để demo chuông thông báo
export const RECIPIENT_USERS: RecipientUser[] = [
  { username: CURRENT_USER.username, name: CURRENT_USER.name, groups: CURRENT_USER.groups },
  { username: 'nguyenvanan', name: 'Nguyễn Văn An', groups: ['Lãnh đạo Bộ phận quản trị'] },
  { username: 'tranthibinh', name: 'Trần Thị Bình', groups: ['Cán bộ nghiệp vụ Hộ tịch điện tử'] },
  { username: 'levancuong', name: 'Lê Văn Cường', groups: ['Cán bộ nghiệp vụ thi hành án dân sự'] },
  { username: 'phamthidung', name: 'Phạm Thị Dung', groups: ['Cán bộ nghiệp vụ quản lý hồ sơ quốc tịch'] },
  { username: 'hoangvanem', name: 'Hoàng Văn Em', groups: ['Lãnh đạo nghiệp vụ Hộ tịch điện tử'] },
  { username: 'vuthiphuong', name: 'Vũ Thị Phương', groups: ['Cán bộ nghiệp vụ CSDL quốc gia về pháp luật'] },
  { username: 'dangvangiang', name: 'Đặng Văn Giang', groups: ['Cán bộ nghiệp vụ Hộ tịch điện tử'] },
  { username: 'buithihoa', name: 'Bùi Thị Hoa', groups: ['Lãnh đạo nghiệp vụ quản lý hồ sơ quốc tịch'] },
  { username: 'dovankhanh', name: 'Đỗ Văn Khánh', groups: [] },
  { username: 'ngothilan', name: 'Ngô Thị Lan', groups: ['Cán bộ nghiệp vụ thi hành án dân sự'] },
  { username: 'duongvanminh', name: 'Dương Văn Minh', groups: [] },
];

// Người dùng có thuộc đối tượng nhận hay không
export const isAudienceMember = (audience: NotificationAudience, user: { username: string; groups: string[] }) => {
  if (audience.mode === 'all') return true;
  if (audience.mode === 'groups') return user.groups.some(g => audience.groups.includes(g));
  return audience.users.includes(user.username);
};
