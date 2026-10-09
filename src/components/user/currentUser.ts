// Người dùng đang đăng nhập (mock) — cùng cấu trúc trường với User ở Quản lý người dùng
// (admin/UserManagementPage.tsx): name, username, email, phone, department, role, groups, status,
// kèm createdDate / lastLogin. Thay bằng dữ liệu từ API phiên đăng nhập khi có backend.
export interface CurrentUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  groups: string[];
  status: 'active' | 'inactive';
  createdDate: string; // dd/mm/yyyy
  lastLogin: string;   // dd/mm/yyyy HH:mm:ss
}

// Giữ khớp với tên/vai trò/email đang hiển thị ở TopBar
export const CURRENT_USER: CurrentUser = {
  id: 0,
  name: 'Nguyễn Văn A',
  username: 'admin',
  email: 'admin@moj.gov.vn',
  phone: '024 3933 3333',
  department: 'Cục Công nghệ thông tin',
  role: 'Quản trị viên',
  groups: ['Quản trị viên'],
  status: 'active',
  createdDate: '01/01/2024',
  lastLogin: '21/05/2026 10:30:15',
};
