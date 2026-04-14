# TÀI LIỆU RÀ SOÁT TÍNH NĂNG POPUP TRÊN TOÀN HỆ THỐNG

Tài liệu này đánh giá hiện trạng các thành phần tương tác (Button, Action) cho **TẤT CẢ** các Phân hệ (Modules) trong hệ thống.

## Ghi chú Trạng thái Popup
- ✅ **Có Popup (Hoàn chỉnh)**: Thao tác gọi một Modal Component (React Portal, Dialog) riêng biệt để xử lý.
- ℹ️ **Điều hướng / API / Action Ngầm**: Các nút bấm có mục đích mở một Tab khác, xác nhận hành động trực tiếp mà không cần confirm, hoặc để tắt màn hình.
- ❌ **Popup Cảnh báo/Chưa hoàn thiện**: Các thao tác gọi hàm Alert mặc định của trình duyệt (`alert(...)`) thay vì sử dụng Modal chuẩn của dự án.

---

# MODULE: ADMIN

### File: `admin/AccessLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |

### File: `admin/AccountManagementLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |

### File: `admin/BackupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{isBackingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}** | `\|h\|a\|n\|d\|l\|e\|B\|a\|c\|k\|u\|p\|N\|o\|w\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tải xuống** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|b\|a\|c\|k\|u\|p\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|b\|a\|c\|k\|u\|p\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|o\|p\|e\|n\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|b\|a\|c\|k\|u\|p\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa bản sao lưu** | `\|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |

### File: `admin/ConfigChangeLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Nhật ký thay đổi cấu hình** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quản lý thời gian lưu trữ nhật ký** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|t\|e\|n\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |

### File: `admin/ErrorLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |

### File: `admin/FunctionListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|U\|s\|e\|r\|G\|r\|o\|u\|p\|(\|'\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ chức năn** | `\|h\|a\|n\|d\|l\|e\|S\|y\|n\|c\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/FunctionManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{isExpanded ? ( ) : ( )}** | `\|(\|e\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|e\|.\|s\|t\|o\|p\|P\|r\|o\|p\|a\|g\|a\|t\|i\|o\|n\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|c\|r\|e\|a\|t\|e\|M\|e\|n\|u\|:\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|c\|r\|e\|a\|t\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|a\|c\|t\|i\|v\|e\|:\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|a\|c\|t\|i\|v\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm quyền** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|'\|a\|d\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|'\|)\|` | ✅ Đóng/Mở Modal |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|'\|e\|d\|i\|t\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|'\|,\| \|p\|e\|r\|m\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|(\|p\|e\|r\|m\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Làm mới** | `\|h\|a\|n\|d\|l\|e\|R\|e\|f\|r\|e\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **{modalType === 'addPermission' ? 'Thêm mới' : 'Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/GroupManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm nhóm mới** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|d\|d\|'\|)\|` | ✅ Đóng/Mở Modal |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|e\|d\|i\|t\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|d\|e\|l\|e\|t\|e\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Đóng/Mở Modal |
| **Chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|d\|e\|t\|a\|i\|l\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Đóng/Mở Modal |
| **Thành viên** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|d\|d\|-\|m\|e\|m\|b\|e\|r\|s\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Đóng/Mở Modal |
| **Phân quyền** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|s\|s\|i\|g\|n\|-\|f\|u\|n\|c\|t\|i\|o\|n\|s\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Thêm thành viên** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gán quyền** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |

### File: `admin/LogRetentionConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm mới** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|o\|n\|f\|i\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|o\|n\|f\|i\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|c\|o\|n\|f\|i\|r\|m\|A\|d\|d\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Cập nhật** | `\|c\|o\|n\|f\|i\|r\|m\|E\|d\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|C\|o\|n\|f\|i\|r\|m\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \|.\|.\|.\|` | ℹ️ Nút Đóng Popup |
| **Xóa** | `\|c\|o\|n\|f\|i\|r\|m\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/PasswordRuleConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Đặt lại mặc định** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|T\|o\|D\|e\|f\|a\|u\|l\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu quy tắc** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|R\|u\|l\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|U\|p\|p\|e\|r\|c\|a\|s\|e\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|U\|p\|p\|e\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|L\|o\|w\|e\|r\|c\|a\|s\|e\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|L\|o\|w\|e\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|N\|u\|m\|b\|e\|r\|s\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|N\|u\|m\|b\|e\|r\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|S\|p\|e\|c\|i\|a\|l\|C\|h\|a\|r\|s\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|S\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu ngay** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|R\|u\|l\|e\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/SecurityConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Đặt lại mặc định** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|T\|o\|D\|e\|f\|a\|u\|l\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu cấu hình** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|C\|o\|n\|f\|i\|g\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|g\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|C\|h\|a\|n\|g\|e\|P\|a\|s\|s\|w\|o\|r\|d\|O\|n\|F\|i\|r\|s\|t\|L\|o\|g\|i\|n\|'\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|g\|C\|h\|a\|n\|g\|e\|(\|'\|e\|n\|a\|b\|l\|e\|W\|o\|r\|k\|i\|n\|g\|H\|o\|u\|r\|s\|R\|e\|s\|t\|r\|i\|c\|t\|i\|o\|n\|'\|,\| \|!\|c\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|g\|C\|h\|a\|n\|g\|e\|(\|'\|e\|n\|a\|b\|l\|e\|A\|u\|t\|o\|B\|a\|c\|k\|u\|p\|'\|,\| \|!\|c\|o\|n\|f\|i\|g\|.\|e\|n\|a\|b\|l\|e\|A\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu ngay** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|C\|o\|n\|f\|i\|g\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/StatisticsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tải biểu đồ** | `\|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|C\|h\|a\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem biểu đồ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|c\|h\|a\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem bảng dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|t\|a\|b\|l\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|o\|w\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `admin/SystemConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Đặt lại mặc định** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu cấu hình** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hàng ngày** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|b\|a\|c\|k\|u\|p\|S\|c\|h\|e\|d\|u\|l\|e\|'\|,\| \|'\|d\|a\|i\|l\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hàng tuần** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|b\|a\|c\|k\|u\|p\|S\|c\|h\|e\|d\|u\|l\|e\|'\|,\| \|'\|w\|e\|e\|k\|l\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hàng tháng** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|b\|a\|c\|k\|u\|p\|S\|c\|h\|e\|d\|u\|l\|e\|'\|,\| \|'\|m\|o\|n\|t\|h\|l\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/UserActivityHistoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{tab.icon} {tab.label}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|t\|a\|b\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Kết xuất** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `admin/UserManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Đồng bộ người dùng** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|s\|y\|n\|c\|'\|)\|` | ✅ Đóng/Mở Modal |
| **Nhập khẩu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|i\|m\|p\|o\|r\|t\|'\|)\|` | ✅ Đóng/Mở Modal |
| **Xuất khẩu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|e\|x\|p\|o\|r\|t\|'\|)\|` | ✅ Đóng/Mở Modal |
| **{user.groups.length} nhóm** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|U\|s\|e\|r\|(\|u\|s\|e\|r\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|d\|e\|t\|a\|i\|l\|'\|,\| \|u\|s\|e\|r\|)\|` | ✅ Đóng/Mở Modal |
| **{user.status === 'locked' ? : }** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|u\|s\|e\|r\|.\|s\|t\|a\|t\|u\|s\| \|=\|=\|=\| \|'\|l\|o\|c\|k\|e\|d\|'\| \|?\| \|'\|u\|n\|l\|o\|c\|k\|'\| \|:\| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đặt lại mật khẩu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|r\|e\|s\|e\|t\|-\|p\|a\|s\|s\|w\|o\|r\|d\|'\|,\| \|u\|s\|e\|r\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |
| **Xuất khẩu** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|U\|s\|e\|r\|s\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đồng bộ ngay** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|L\|o\|g\|i\|c\| \|đ\|ồ\|n\|g\| \|b\|ộ\| \|n\|g\|ư\|ờ\|i\| \|d\|ù\|n\|g\|\|
\| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |

---

# MODULE: CATEGORY

### File: `category/CategoryApprovalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Trình duyệt danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **{tab === 'pending' && } {tab === 'approved' && } {** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|t\|a\|b\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **{selectedCategories.length === filteredCategories.** | `\|h\|a\|n\|d\|l\|e\|S\|e\|l\|e\|c\|t\|A\|l\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|r\|e\|a\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Trình duyệt ({selectedCategories.length})** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|S\|e\|l\|e\|c\|t\|e\|d\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|r\|e\|a\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|r\|e\|a\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Tạo và trình duyệt** | `\|h\|a\|n\|d\|l\|e\|C\|r\|e\|a\|t\|e\|A\|n\|d\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gửi trình duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/CategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cập nhật** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|-\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nhập từ Excel** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|I\|m\|p\|o\|r\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm bản ghi mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm cột mới** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa cấu trúc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Ngừng áp dụng bản ghi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Phê duyệt hàng loạt** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối hàng loạt** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|R\|e\|j\|e\|c\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|A\|p\|p\|r\|o\|v\|a\|l\|D\|e\|t\|a\|i\|l\|(\|r\|e\|q\|u\|e\|s\|t\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|r\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|r\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|'\|'\|,\| \|d\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\|\|
\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Lưu thay đổi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|D\|i\|r\|e\|c\|t\| \|s\|a\|v\|e\| \|f\|o\|r\| \|u\|s\|e\|r\|s\| \|w\|i\|t\|h\| \|p\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **a.id === editedCategoryData.approver); setSuccessN** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|V\|a\|l\|i\|d\|a\|t\|e\| \|a\|p\|p\|r\|o\|v\|e\|r\| \|s\|e\|l\|e\|c\|t\|i\|o\|n\|\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|(\|[\|.\|.\|.\|n\|e\|w\|C\|a\|t\|e\|g\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **field.name.toLowerCase() === newFieldData.name.toL** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|V\|a\|l\|i\|d\|a\|t\|i\|o\|n\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|h\|a\|n\|d\|l\|e\|C\|a\|n\|c\|e\|l\|I\|m\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|a\|n\|c\|e\|l\|I\|m\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **0} className="px-4 py-2 bg-green-600 text-white ro** | `\|h\|a\|n\|d\|l\|e\|I\|m\|p\|o\|r\|t\|C\|o\|n\|f\|i\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|a\|l\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|a\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xác nhận phê duyệt** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|j\|e\|c\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xác nhận từ chối** | `\|c\|o\|n\|f\|i\|r\|m\|R\|e\|j\|e\|c\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng thông báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|c\|c\|e\|s\|s\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |

### File: `category/CategoryPublishedListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|i\|t\|e\|m\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **×** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Tải {fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `category/CategoryReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/CategorySetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{tab.label}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|t\|a\|b\|.\|i\|d\| \|a\|s\| \|T\|a\|b\|T\|y\|p\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/CategorySetupPageNew.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm cột mới** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|'\|'\|,\| \|d\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\|\|
\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|(\|[\|.\|.\|.\|n\|e\|w\|C\|a\|t\|e\|g\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **field.name.toLowerCase() === newFieldData.name.toL** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|V\|a\|l\|i\|d\|a\|t\|i\|o\|n\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/CategoryStatisticsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/CategoryStatisticsReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tìm kiếm và lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo phân loại** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thống kê lượt truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|c\|c\|e\|s\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/components/tabs/ApprovalTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{tab.label}** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|T\|a\|b\|(\|t\|a\|b\|.\|k\|e\|y\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **{tab.label} ({tab.count})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|t\|a\|b\|.\|k\|e\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|o\|n\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|q\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|o\|n\|A\|p\|p\|r\|o\|v\|e\|C\|l\|i\|c\|k\|(\|r\|e\|q\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|o\|n\|R\|e\|j\|e\|c\|t\|C\|l\|i\|c\|k\|(\|r\|e\|q\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cập nhật (1) {historyOpen ? '▲' : '▼'}** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|H\|i\|s\|t\|o\|r\|y\|(\|r\|e\|q\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/components/tabs/AttributesTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Lưu & trình duyệt** | `\|o\|n\|S\|a\|v\|e\|A\|n\|d\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm thuộc tính** | `\|o\|n\|A\|d\|d\|A\|t\|t\|r\|i\|b\|u\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/components/tabs/RelationshipsTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm quan hệ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|q\|u\|e\|s\|t\|D\|a\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu & trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|q\|u\|e\|s\|t\|D\|a\|t\|a\|(\|{\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **{editingRelationship ? 'Lưu cập nhật' : 'Thêm quan** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/components/tabs/SetupTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm mới** | `\|o\|n\|A\|d\|d\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `category/components/tabs/VersionHistoryTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Lọc lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|(\|v\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Áp dụng bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: CATEGORYMANAGEMENTPAGE.TSX

### File: `CategoryManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt danh mục {stats.pending > 0 && ( {stats.** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công bố danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo & Tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công bố danh mục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem dữ liệu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng danh mục {stats.total}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã phê duyệt {stats.approved}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ phê duyệt {stats.pending}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nháp {stats.draft}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|d\|r\|a\|f\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối {stats.rejected}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã công bố {stats.published}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|s\|h\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem danh mục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đề xuất công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|r\|o\|p\|o\|s\|e\|P\|u\|b\|l\|i\|s\|h\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|r\|e\|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tìm kiếm** | `\|h\|a\|n\|d\|l\|e\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa điều kiện** | `\|r\|e\|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Gửi yêu cầu phê duyệt** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xác nhận công bố** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

---

# MODULE: CATEGORYMANAGEMENTPAGE_BACKUP.TSX

---

# MODULE: COLLECTION

### File: `collection/CollectionSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|r\|v\|i\|c\|e\|-\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quản lý nhật ký** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Bỏ lọc** | `\|r\|e\|s\|e\|t\|F\|i\|l\|t\|e\|r\|s\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm dịch vụ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|S\|e\|r\|v\|i\|c\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Kết xuất danh sách** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|e\|r\|v\|i\|c\|e\|L\|i\|s\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **{service.statusText}** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Cài đặt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Trước** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|>\| \|1\| \|?\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\| \|:\| \|c\|u\|r\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sau** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\| \|=\| \|M\|a\|t\|h\|.\|c\|e\|i\|l\|(\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|>\| \|1\| \|?\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\| \|:\| \|c\|u\|r\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\| \|=\| \|M\|a\|t\|h\|.\|c\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|r\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|r\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Gửi thông báo hệ thống nguồn** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|n\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|T\|o\|S\|o\|u\|r\|c\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|.\|.\|.\|` | ✅ Đóng/Mở Modal |

### File: `collection/InternalDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xem chi tiết hồ sơ nguồn** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|o\|u\|r\|c\|e\|(\|s\|o\|u\|r\|c\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |

### File: `collection/ServiceDataDetailPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Kết xuất** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem hồ sơ gốc (Phiếu ý kiến)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|C\|o\|d\|e\|(\|r\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Trang trước** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|p\|r\|e\|v\| \|=\|>\| \|M\|a\|t\|h\|.\|m\|a\|x\|(\|1\|,\| \|p\|r\|e\|v\| \|-\| \|1\|)\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Trang sau** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|p\|r\|e\|v\| \|=\|>\| \|M\|a\|t\|h\|.\|m\|i\|n\|(\|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\|,\| \|p\|r\|e\|v\| \|+\| \|1\|)\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: DATACLEANINGMANAGEMENTPAGE.TSX

---

# MODULE: DATACOLLECTIONFILESPAGE.TSX

### File: `DataCollectionFilesPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã tiếp nhận** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|r\|e\|c\|e\|i\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hoàn tất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|c\|o\|m\|p\|l\|e\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: DATACOLLECTIONPAGE.TSX

### File: `DataCollectionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tổng quan** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|o\|v\|e\|r\|v\|i\|e\|w\|-\|c\|o\|m\|b\|i\|n\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách thu thập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|o\|v\|e\|r\|v\|i\|e\|w\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nhận dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|r\|e\|c\|e\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|s\|e\|n\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nhật ký** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|c\|t\|i\|v\|i\|t\|y\|-\|l\|o\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: DATACOORDINATIONPAGE.TSX

### File: `DataCoordinationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quản lý API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|i\|-\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cung cấp thụ động {stats.pendingRequests > 0 && ( ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|a\|s\|s\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Giám sát** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|m\|o\|n\|i\|t\|o\|r\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh mục dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|c\|a\|t\|a\|l\|o\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đăng ký dịch vụ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|S\|e\|r\|v\|i\|c\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Tổng dịch vụ {stats.totalServices}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang hoạt động {stats.activeServices}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ phê duyệt {stats.pendingServices}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|E\|d\|i\|t\|(\|s\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Tạo yêu cầu mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|q\|u\|e\|s\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Bắt ầu xử lý** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|F\|o\|r\|D\|e\|t\|a\|i\|l\|(\|r\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **{expandedErrorLog === idx ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|E\|r\|r\|o\|r\|L\|o\|g\|(\|e\|x\|p\|a\|n\|d\|e\|d\|E\|r\|r\|o\|r\|L\|o\|g\| \|=\|=\|=\| \|i\|d\|x\| \|?\| \|n\|u\|l\|l\| \|:\| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã gửi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **{dept.department} {dept.services.length} dịch vụ {** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|D\|e\|p\|a\|r\|t\|m\|e\|n\|t\|(\|d\|e\|p\|t\|.\|d\|e\|p\|a\|r\|t\|m\|e\|n\|t\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Copy mã dịch vụ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|n\|a\|v\|i\|g\|a\|t\|o\|r\|.\|c\|l\|i\|p\|b\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem tài liệu API** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |

---

# MODULE: DATAPROCESSINGPAGE.TSX

---

# MODULE: DATARECONCILIATIONPAGE.TSX

### File: `DataReconciliationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{reconcilingId === item.id ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|o\|n\|f\|i\|r\|m\|R\|e\|c\|o\|n\|c\|i\|l\|e\|I\|d\|(\|i\|t\|e\|m\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|o\|n\|f\|i\|r\|m\|R\|e\|c\|o\|n\|c\|i\|l\|e\|I\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xác nhận đối soát** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|r\|t\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi thông báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: DATASEARCHPAGE.TSX

### File: `DataSearchPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Dữ liệu chủ Tra cứu dữ liệu chủ của hệ thống 2,847** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|y\|p\|e\|(\|'\|m\|a\|s\|t\|e\|r\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Dữ liệu mở Tra cứu dữ liệu công khai 1,234,567 bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|y\|p\|e\|(\|'\|o\|p\|e\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Dữ liệu dùng chung Tra cứu dữ liệu được chia sẻ 89** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|y\|p\|e\|(\|'\|s\|h\|a\|r\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: DATASHARINGPAGE.TSX

---

# MODULE: EXTERNAL

---

# MODULE: INTERNAL

---

# MODULE: LOGINPAGE.TSX

### File: `LoginPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{showPassword ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|a\|s\|s\|w\|o\|r\|d\|(\|!\|s\|h\|o\|w\|P\|a\|s\|s\|w\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: MASTER-DATA

### File: `master-data/ApprovalTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tất cả ({records.length})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ phê duyệt ({pendingCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã phê duyệt ({approvedCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối ({rejectedCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cập nhật ({record.history.length}) {isExpa** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|H\|i\|s\|t\|o\|r\|y\|(\|i\|s\|E\|x\|p\|a\|n\|d\|e\|d\| \|?\| \|n\|u\|l\|l\| \|:\| \|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hành động** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hành động** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|F\|o\|r\|m\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|F\|o\|r\|m\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **{approvalAction === 'approve' ? ( <> Xác nhận phê ** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/AttributesManagementTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{selectedEntityData ? ( {selectedEntityData.code} ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|o\|m\|b\|o\|b\|o\|x\|O\|p\|e\|n\|(\|!\|c\|o\|m\|b\|o\|b\|o\|x\|O\|p\|e\|n\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{entity.code} - {entity.name} {selectedEntity === ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|E\|n\|t\|i\|t\|y\|(\|e\|n\|t\|i\|t\|y\|.\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm thuộc tính** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **v{attribute.version}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|H\|i\|s\|t\|o\|r\|y\|(\|a\|t\|t\|r\|i\|b\|u\|t\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|a\|t\|t\|r\|i\|b\|u\|t\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|a\|t\|t\|r\|i\|b\|u\|t\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **{editingAttribute ? 'Cập nhật' : 'Tạo mới'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|H\|i\|s\|t\|o\|r\|y\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|H\|i\|s\|t\|o\|r\|y\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |

### File: `master-data/EntityRelationshipsTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm quan hệ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **{editingRelationship ? 'Cập nhật' : 'Lưu quan hệ'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/HistoryTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **📋 Danh sách** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **📅 Timeline** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|t\|i\|m\|e\|l\|i\|n\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết bản ghi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|(\|{\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **So sánh với phiên bản {selectedHistory[index - 1].** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|C\|o\|m\|p\|a\|r\|e\|V\|e\|r\|s\|i\|o\|n\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Khôi phục version này** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|R\|e\|s\|t\|o\|r\|e\|R\|e\|c\|o\|r\|d\|C\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|m\|p\|a\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **📅 Xem Timeline** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|T\|i\|m\|e\|l\|i\|n\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **h.version === selectedRestoreVersion)?.date}` ); s** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|c\|o\|n\|f\|i\|r\|m\|e\|d\| \|=\| \|w\|i\|n\|d\|o\|w\|.\|c\|o\|n\|f\|i\|r\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MasterDataAPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\|)\| \|{\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\|)\| \|{\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Hủy công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\|)\| \|{\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Khôi phục** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|(\|n\|e\|w\| \|S\|e\|t\|(\|)\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{getApprovalStatusText(record.approvalStatus)}** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|r\|e\|c\|o\|r\|d\|.\|a\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|u\|s\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chi tiết nguồn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gửi phê duyệt ngay** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|!\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|)\| \|{\|\|
\| \| \| \| \| \| \| \|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **{ const selectedData = data.filter(r => selectedRe** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy công khai ngay** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|h\|a\|n\|d\|l\|e\|U\|n\|p\|u\|b\|l\|i\|s\|h\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **v{version} {version === 4 && '25/12/2024'} {versio** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|n\|e\|w\|V\|e\|r\|s\|i\|o\|n\|s\| \|=\| \|n\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Khôi phục ngay** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|l\|e\|t\| \|s\|u\|m\|m\|a\|r\|y\| \|=\| \|'\|♻\|️\| \|X\|Á\|C\| \|N\|H\|Ậ\|N\| \|K\|H\|Ô\|I\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MasterDataApprovalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Trình duyệt mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Chờ duyệt ({stats.pending})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã duyệt ({stats.approved})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối ({stats.rejected})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tất cả ({stats.total})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|a\|p\|p\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Gửi trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gửi trình duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **{approvalType === 'approve' ? : } {approvalType ==** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|a\|l\|e\|r\|t\|(\|`\|Đ\|ã\| \|$\|{\|a\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\| \|=\|=\|=\| \|'\|a\|p\|p\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |

### File: `master-data/MasterDataManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Quản lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tra cứu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MasterDataPublishPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Gỡ công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|(\|d\|a\|t\|a\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|(\|d\|a\|t\|a\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Gỡ công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `master-data/MasterDataReportsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tra cứu dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo sử dụng dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|u\|s\|a\|g\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo vòng đời dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|f\|e\|c\|y\|c\|l\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|s\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Xóa bộ lọc** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|F\|i\|l\|t\|e\|r\|s\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tìm kiếm** | `\|h\|a\|n\|d\|l\|e\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hiển thị bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|s\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **In** | `\|h\|a\|n\|d\|l\|e\|P\|r\|i\|n\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MasterDataScaleManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập DL chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thiết lập thuộc tính** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|t\|t\|r\|i\|b\|u\|t\|e\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thiết lập quy tắc hợp nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|r\|g\|e\|-\|r\|u\|l\|e\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thiết lập quan hệ thực thể** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quy tắc định danh duy nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|i\|d\|e\|n\|t\|i\|f\|i\|e\|r\|-\|r\|u\|l\|e\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tạo mới (Wizard 5 bước)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|W\|i\|z\|a\|r\|d\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm mới nhanh** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Nút bấm** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|e\|n\|t\|i\|t\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút bấm** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút bấm** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **{editingEntity ? 'Cập nhật' : 'Tạo mới'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MasterDataSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm cấu hình mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Cập nhật** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `master-data/MasterDataUpdateReviewTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi phê duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai** | `\|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|(\|n\|e\|w\| \|S\|e\|t\|(\|)\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MasterDataUpdateTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Rà soát** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|r\|e\|v\|i\|e\|w\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Theo dõi lịch sử thay đổi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quản lý phiên bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{isExpanded ? : }** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|H\|i\|s\|t\|o\|r\|y\|(\|i\|s\|E\|x\|p\|a\|n\|d\|e\|d\| \|?\| \|n\|u\|l\|l\| \|:\| \|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{record.visibility === 'public' ? ( <> Công khai )** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|V\|i\|s\|i\|b\|i\|l\|i\|t\|y\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gỡ công khai** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|v\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|v\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **{reviewAction === 'approve' ? ( <> Xác nhận phê du** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|R\|e\|v\|i\|e\|w\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data/MergeRulesManagementTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm quy tắc mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Kiểm thử** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|T\|e\|s\|t\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|T\|o\|g\|g\|l\|e\|S\|t\|a\|t\|u\|s\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm nguồn** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|S\|o\|u\|r\|c\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Xóa (Icon Trash)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|S\|o\|u\|r\|c\|e\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm quy tắc so khớp** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|M\|a\|t\|c\|h\|R\|u\|l\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Xóa (Icon Trash)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|M\|a\|t\|c\|h\|R\|u\|l\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm quy tắc trích rút** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|E\|x\|t\|r\|a\|c\|t\|R\|u\|l\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Xóa (Icon Trash)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|E\|x\|t\|r\|a\|c\|t\|R\|u\|l\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **{editingRule ? 'Cập nhật' : 'Lưu quy tắc'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|T\|e\|s\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|T\|e\|s\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `master-data/UniqueIdentifierRulesTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm quy tắc mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Sao chép** | `\|(\|)\| \|=\|>\| \|c\|o\|p\|y\|T\|o\|C\|l\|i\|p\|b\|o\|a\|r\|d\|(\|r\|u\|l\|e\|.\|e\|x\|a\|m\|p\|l\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Làm mới** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|F\|o\|r\|m\|C\|h\|a\|n\|g\|e\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sao chép** | `\|(\|)\| \|=\|>\| \|c\|o\|p\|y\|T\|o\|C\|l\|i\|p\|b\|o\|a\|r\|d\|(\|g\|e\|n\|e\|r\|a\|t\|e\|d\|E\|x\|a\|m\|p\|l\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{duplicateCheck.checking ? 'Đang kiểm tra...' : 'K** | `\|h\|a\|n\|d\|l\|e\|C\|h\|e\|c\|k\|D\|u\|p\|l\|i\|c\|a\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **{editingRule ? 'Cập nhật' : 'Lưu quy tắc'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: MASTER-DATA-LIST

### File: `master-data-list/MasterDataListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng dữ liệu chủ {masterData.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang hoạt động {masterData.filter(c => c.isActive)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Dữ liệu chuẩn {masterData.filter(c => c.dataType =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Dữ liệu tham chiếu {masterData.filter(c => c.dataT** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|f\|e\|r\|e\|n\|c\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\|\|
\| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ duyệt {approvalRequests.filter(r => r.status =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã duyệt {approvalRequests.filter(r => r.status ==** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối {approvalRequests.filter(r => r.status ===** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng dữ liệu đã công khai {publishedMasterData.len** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai {publishedMasterData.filter(d => d.statu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|c\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Riêng tư {publishedMasterData.filter(d => d.status** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|r\|i\|v\|a\|t\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `master-data-list/MasterDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Tổng số bản ghi {totalItems}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang hoạt động {activeItems}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Ngừng hoạt động {inactiveItems}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|i\|n\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|e\|r\|m\|(\|'\|'\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **{expandedRows.has(item.id) ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|R\|o\|w\|E\|x\|p\|a\|n\|d\|(\|i\|t\|e\|m\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: MASTERDATAPAGE.TSX

### File: `MasterDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quản lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt {stats.review > 0 && ( {stats.review} )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai {stats.approved > 0 && ( {stats.approved** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tra cứu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thiết lập dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Quản lý thuộc tính** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|t\|t\|r\|i\|b\|u\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Quy tắc hợp nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|M\|e\|r\|g\|e\|R\|u\|l\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Quan hệ thực thể** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Định danh duy nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|I\|d\|e\|n\|t\|i\|f\|i\|e\|r\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|E\|n\|t\|i\|t\|y\|(\|e\|n\|t\|i\|t\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|e\|n\|t\|i\|t\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cập nhật bản ghi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|e\|n\|t\|i\|t\|y\|.\|i\|s\|L\|o\|c\|k\|e\|d\|)\| \|{\|\|
\| \| \| \| \| \|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Quản lý phiên bản** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|E\|n\|t\|i\|t\|y\|(\|e\|n\|t\|i\|t\|y\|)\|;\|\|
\| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|R\|e\|v\|i\|e\|w\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Mở khóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|U\|n\|l\|o\|c\|k\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Khóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|L\|o\|c\|k\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu trữ** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|r\|c\|h\|i\|v\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy công khai** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|U\|n\|p\|u\|b\|l\|i\|s\|h\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|v\|o\|k\|e\|A\|p\|p\|r\|o\|v\|a\|l\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|E\|n\|t\|i\|t\|y\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: NEW-CATEGORY

### File: `new-category/NewCategorySetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng danh mục {categories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang hoạt động {categories.filter(c => c.isActive)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh mục chuẩn {categories.filter(c => c.dataType ** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh mục tham chiếu {categories.filter(c => c.data** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|f\|e\|r\|e\|n\|c\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\|\|
\| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ duyệt {approvalRequests.filter(r => r.status =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã duyệt {approvalRequests.filter(r => r.status ==** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối {approvalRequests.filter(r => r.status ===** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng đã công khai {publishedCategories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang công khai {publishedCategories.filter(c => c.** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|c\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|P\|u\|b\|l\|i\|s\|h\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: NOTIFICATIONPAGE.TSX

### File: `NotificationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chưa đọc ({unreadCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|u\|n\|r\|e\|a\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã đọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|r\|e\|a\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đánh dấu đã đọc** | `\|(\|)\| \|=\|>\| \|m\|a\|r\|k\|A\|s\|R\|e\|a\|d\|(\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|d\|e\|l\|e\|t\|e\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đánh dấu đã đọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|m\|a\|r\|k\|A\|s\|R\|e\|a\|d\|(\|s\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: OPEN-DATA

### File: `open-data/OpenDataApprovalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Trình duyệt mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Chờ duyệt ({stats.pending})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã phê duyệt ({stats.approved})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối ({stats.rejected})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tất cả ({stats.total})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Gửi trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gửi trình duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **{approvalType === 'approve' ? : } {approvalType ==** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|a\|l\|e\|r\|t\|(\|`\|Đ\|ã\| \|$\|{\|a\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\| \|=\|=\|=\| \|'\|a\|p\|p\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |

### File: `open-data/OpenDataPublishedListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|i\|t\|e\|m\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **×** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Tải {fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `open-data/OpenDataPublishPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|s\|e\|t\|(\|d\|a\|t\|a\|s\|e\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `open-data/OpenDataReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `open-data/OpenDataSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Quản lý danh mục {categories.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt {approvalList.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử thay đổi {historyList.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tất cả {approvalList.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ phê duyệt {approvalStats.pending}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã phê duyệt {approvalStats.approved}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối {approvalStats.rejected}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm danh mục mới** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|(\|r\|e\|c\|o\|r\|d\| \|a\|s\| \|a\|n\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tải xuống** | `\|(\|)\| \|=\|>\| \|a\|l\|e\|r\|t\|(\|`\|T\|ả\|i\| \|x\|u\|ố\|n\|g\| \|p\|h\|i\|ê\|n\| \|b\|ả\|n\| \|$\|{\|r\|e\|c\|o\|r\|d\|.\|v\|e\|r\|s\|i\|o\|n\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|a\|l\|e\|r\|t\|(\|`\|K\|h\|ô\|i\| \|p\|h\|ụ\|c\| \|v\|ề\| \|p\|h\|i\|ê\|n\| \|b\|ả\|n\| \|$\|{\|r\|e\|c\|o\|r\|d\|.\|v\|e\|r\|s\|i\|o\|n\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **{category.name} {category.description}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|a\|t\|e\|g\|o\|r\|y\|C\|l\|i\|c\|k\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|F\|o\|r\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Chọn tất cả** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|a\|l\|l\|F\|i\|e\|l\|d\|I\|d\|s\| \|=\| \|m\|o\|c\|k\|T\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|s\|e\|l\|e\|c\|t\|e\|d\|F\|i\|e\|l\|d\|s\|:\| \|[\|]\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa file** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|t\|t\|a\|c\|h\|e\|d\|F\|i\|l\|e\|s\|(\|a\|t\|t\|a\|c\|h\|e\|d\|F\|i\|l\|e\|s\|.\|f\|i\|l\|t\|e\|r\|(\|(\|_\|,\| \|i\|)\| \|=\|>\| \|i\| \|!\|=\|=\| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|A\|d\|d\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi phê duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|E\|d\|i\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|c\|o\|n\|f\|i\|r\|m\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Phê duyệt** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|A\|c\|t\|i\|o\|n\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Từ chối** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|A\|c\|t\|i\|o\|n\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gửi phê duyệt** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|A\|c\|t\|i\|o\|n\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `open-data/OpenDataUpdateRulesPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm quy tắc mới** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chạy ngay** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|n\|N\|o\|w\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử chạy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Chọn tất cả** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|a\|l\|l\|F\|i\|e\|l\|d\|s\| \|=\| \|m\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|s\|e\|l\|e\|c\|t\|e\|d\|F\|i\|e\|l\|d\|s\|:\| \|[\|]\|` | ℹ️ Action Ngầm / Điều hướng |
| **+ Thêm** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|E\|m\|a\|i\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|m\|o\|v\|e\|E\|m\|a\|i\|l\|(\|e\|m\|a\|i\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem trước** | `\|h\|a\|n\|d\|l\|e\|P\|r\|e\|v\|i\|e\|w\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|D\|r\|a\|f\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lưu & Kích hoạt** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|A\|n\|d\|A\|c\|t\|i\|v\|a\|t\|e\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|H\|i\|s\|t\|o\|r\|y\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

---

# MODULE: OPEN-DATA-CATEGORY

### File: `open-data-category/OpenDataCategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|a\|t\|e\|g\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Metadata** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|t\|a\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Giấy phép** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|c\|e\|n\|s\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử phiên bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thiết lập lịch công bố** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|c\|h\|e\|d\|u\|l\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|e\|r\|m\|(\|'\|'\|)\|;\|\|
\| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công bố** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Bỏ chọn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|d\|s\|(\|n\|e\|w\| \|S\|e\|t\|(\|)\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|i\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|i\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|U\|n\|p\|u\|b\|l\|i\|s\|h\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm lịch mới** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|c\|h\|e\|d\|u\|l\|e\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\|\|
\| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|c\|h\|e\|d\|u\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|c\|h\|e\|d\|u\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|c\|o\|d\|e\| \||\||\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|c\|o\|d\|e\| \||\||\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xác nhận** | `\|c\|o\|n\|f\|i\|r\|m\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xác nhận** | `\|c\|o\|n\|f\|i\|r\|m\|U\|n\|p\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Bỏ công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|D\|a\|t\|a\|(\|d\|a\|t\|a\|.\|m\|a\|p\|(\|i\|t\|e\|m\| \|=\|>\|\|
\| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|.\|a\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|u\|s\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Lưu thay đổi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xác nhận công bố** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xác nhận hủy công bố** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|U\|n\|p\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xác nhận phê duyệt** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **a.id === selectedApprover)?.name || ''; setData(da** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|!\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|)\| \|{\|\|
\| \| \| \| \| \| \| \|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **{selectedItem.approvalStatus !== 'approved' ? 'Đón** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|F\|r\|o\|m\|M\|o\|d\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xác nhận công khai** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|)\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xác nhận phê duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|)\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|j\|e\|c\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **item.id === selectedItem.id ? { ...item, approvalS** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|!\|r\|e\|j\|e\|c\|t\|R\|e\|a\|s\|o\|n\|.\|t\|r\|i\|m\|(\|)\|)\| \|{\|\|
\| \| \| \| \|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **{selectedSchedule ? 'Đóng' : 'Hủy'}** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|c\|h\|e\|d\|u\|l\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **{ const selectedDataset = data.find(d => d.id === ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|s\|e\|t\|I\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|S\|c\|h\|e\|d\|u\|l\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xóa lịch** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|c\|h\|e\|d\|u\|l\|e\|s\|(\|s\|c\|h\|e\|d\|u\|l\|e\|s\|.\|f\|i\|l\|t\|e\|r\|(\|s\| \|=\|.\|.\|.\|` | ✅ Đóng/Mở Modal |

### File: `open-data-category/OpenDataCategorySetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công khai danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng danh mục {categories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang hoạt động {categories.filter(c => c.isActive)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh mục chuẩn {categories.filter(c => c.dataType ** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh mục tham chiếu {categories.filter(c => c.data** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|f\|e\|r\|e\|n\|c\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\|\|
\| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ duyệt {approvalRequests.filter(r => r.status =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã duyệt {approvalRequests.filter(r => r.status ==** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối {approvalRequests.filter(r => r.status ===** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng đã công khai {publishedCategories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đang công khai {publishedCategories.filter(c => c.** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|c\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|P\|u\|b\|l\|i\|s\|h\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: OPEN-DATA-REPORT

### File: `open-data-report/OpenDataReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Tìm kiếm và lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo phân loại** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thống kê lượt truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|c\|c\|e\|s\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: OPENDATACATEGORYPAGE.TSX

### File: `OpenDataCategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt danh mục {stats.pending > 0 && ( {stats.** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công bố dữ liệu mở** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Báo cáo & Tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đề xuất công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|r\|o\|p\|o\|s\|e\|P\|u\|b\|l\|i\|s\|h\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Công bố dữ liệu mở** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tổng số danh mục {stats.total}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã phê duyệt {stats.approved}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chờ phê duyệt {stats.pending}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đã công bố {stats.published} {stats.totalDownloads** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|s\|h\|e\|d\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Gửi yêu cầu** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Công bố** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Đặt lại** | `\|r\|e\|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Nút Đóng Popup |
| **Tìm kiếm** | `\|h\|a\|n\|d\|l\|e\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: ORCHESTRATION

### File: `orchestration/APIManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **API chủ động {activeTab === 'active' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cung cấp dữ liệu thụ động hoặc theo yêu cầu {activ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|a\|s\|s\|i\|v\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm API mới** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Giám sát** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xuất dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|o\|r\|t\|D\|r\|o\|p\|d\|o\|w\|n\|I\|d\|(\|e\|x\|p\|o\|r\|t\|D\|r\|o\|p\|d\|o\|w\|n\|I\|d\| \|=\|=\|=\| \|a\|p\|i\|.\|i\|d\| \|?\| \|n\|u\|l\|l\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **JSON** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|j\|s\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **CSV** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|c\|s\|v\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **XML** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|x\|m\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Excel** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|e\|x\|c\|e\|l\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Công bố** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **0 ? headers : (formData.headerName && formData.api** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|T\|e\|s\|t\|U\|r\|l\|(\|`\|$\|{\|f\|o\|r\|m\|D\|a\|t\|a\|.\|b\|a\|s\|e\|U\|r\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|s\|a\|v\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\|\|
\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Công bố** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Cập nhật** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|u\|p\|d\|a\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|d\|e\|l\|e\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\|\|
\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Công bố** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|)\| \|{\|\|
\| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|)\| \|{\|\|
\| \| \| \| \| \| \| \| \| \|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|M\|o\|n\|i\|t\|o\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|M\|o\|n\|i\|t\|o\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `orchestration/DataReconciliationAPIPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm API đối soát mới** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|r\|e\|s\|e\|t\|F\|o\|r\|m\|(\|)\|;\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|s\|a\|v\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Cập nhật** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|u\|p\|d\|a\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|d\|e\|l\|e\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |

### File: `orchestration/ServiceSetupPageUpdated.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thiết lập dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Dữ liệu thụ động/Theo yêu cầu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|a\|s\|s\|i\|v\|e\|-\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấp quyền truy cập API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|e\|r\|m\|i\|s\|s\|i\|o\|n\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Quản lý phiên bản API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Giám sát & Log** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|o\|n\|i\|t\|o\|r\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm dịch vụ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Cấu hình** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Cấp quyền mới** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|G\|r\|a\|n\|t\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thay thế** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|a\|l\|e\|r\|t\|(\|'\|T\|h\|a\|y\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|a\|l\|e\|r\|t\|(\|'\|X\|ó\|a\| \|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Thêm đơn vị** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|i\|F\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm đơn vị** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|i\|F\|o\|r\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm phiên bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|(\|v\|e\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **s.code === versionForm.apiCode); const newVersion:** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|i\|f\| \|(\|!\|v\|e\|r\|s\|i\|o\|n\|F\|o\|r\|m\|.\|a\|p\|i\|C\|o\|d\|e\| \||\||\| \|!\|v\|e\|r\|s\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu thay đổi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu cấu hình** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Đóng/Mở Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa dịch vụ** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Gửi yêu cầu duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **s.id === selectedService.id ? { ...s, status: 'ina** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|/\|/\| \|L\|ấ\|y\| \|g\|i\|á\| \|t\|r\|ị\| \|q\|u\|y\|ế\|t\| \|đ\|ị\|n\|h\| \|t\|ừ\| \|r\|a\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: PROCESSING

### File: `processing/GenericProcessingPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{isApplied ? 'Hủy áp dụng' : 'Áp dụng'}** | `\|(\|e\|:\| \|a\|n\|y\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|R\|u\|l\|e\|A\|p\|p\|l\|i\|c\|a\|t\|i\|o\|n\|(\|i\|d\|,\| \|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **{service.name}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|e\|r\|v\|i\|c\|e\|I\|d\|(\|s\|e\|r\|v\|i\|c\|e\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Làm sạch (4)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|e\|a\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chuẩn hóa (3)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|i\|z\|e\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Biến đổi (3)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|t\|r\|a\|n\|s\|f\|o\|r\|m\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách lỗi (12)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|e\|r\|r\|o\|r\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phân loại dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Chỉnh sửa toàn bảng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Chỉnh sửa các trường** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Gửi tất cả về hệ thống nguồn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu cấu hình** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xác nhận Gửi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingAdminJusticePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingAuctionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingBusinessHouseholdPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingCompensationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingCooperationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingEnforcementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingEnterprisePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingForensicPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingJudgmentPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingJudicialAssistancePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingLawyerPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingLegalAidPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingLegalEducationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingNationalityPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingNotaryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `processing/ProcessingRuleSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\|\|
\| \| \| \| \| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Quản lý quy tắc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|R\|u\|l\|e\|M\|a\|n\|a\|g\|e\|m\|e\|n\|t\|S\|o\|u\|r\|c\|e\|(\|r\|u\|l\|e\|.\|d\|a\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Phân loại dữ liệu** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\|\|
\| \| \| \| \| \| \| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chạy quy tắc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|R\|u\|n\|n\|i\|n\|g\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Danh sách lỗi** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|E\|r\|r\|o\|r\|L\|i\|s\|t\|D\|a\|t\|a\|S\|o\|u\|r\|c\|e\|(\|r\|u\|l\|e\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|H\|i\|s\|t\|o\|r\|y\|D\|a\|t\|a\|S\|o\|u\|r\|c\|e\|(\|r\|u\|l\|e\|.\|d\|a\|t\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|h\|o\|w\|R\|u\|n\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|\|
\| \| \| \| \| \| \|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Bắt đầu chạy** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|a\|l\|e\|r\|t\|(\|`\|B\|ắ\|t\| \|đ\|ầ\|u\| \|c\|h\|ạ\|y\| \|$\|{\|r\|u\|n\|n\|i\|n\|g\|R\|u\|.\|.\|.\|` | ❌ Cảnh báo Alert Browser (Cần nâng cấp) |

### File: `processing/ProcessingSecurityDbPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: PROVISION

### File: `provision/DataProvisionCatalogAPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `provision/DataProvisionCatalogBPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `provision/DataProvisionCatalogCPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `provision/DataProvisionDldcAPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Đóng** | `\|c\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Đóng/Mở Modal |

### File: `provision/DataProvisionInternalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm gói tin mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Cấu hình trường** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

### File: `provision/DataProvisionSharedPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm cấu hình quyền truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|(\|p\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Duyệt** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thu hồi quyền** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|v\|o\|k\|e\|(\|p\|e\|r\|m\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|s\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |

### File: `provision/InternalCatalogProvisionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Dữ liệu danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|a\|t\|a\|l\|o\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Metadata** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|t\|a\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|-\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thêm gói tin mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Xem cấu trúc** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|s\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

---

# MODULE: QUALITYCONTROLPAGE.TSX

### File: `QualityControlPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Kiểm tra dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|v\|a\|l\|i\|d\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thông báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Phản hồi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|t\|r\|a\|c\|k\|i\|n\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: RECONCILIATION

### File: `reconciliation/ReconciliationServiceSetupTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Thêm cấu hình API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|A\|d\|d\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|.\|.\|.\|` | ✅ Đóng/Mở Modal |

---

# MODULE: RECONCILIATIONSETUPPAGE.TSX

### File: `ReconciliationSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Quản lý {activeTab === 'management' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Thiết lập {activeTab === 'setup' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Log {activeTab === 'logs' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Lịch sử {activeTab === 'history' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|.\|.\|.\|` | ✅ Dùng trạng thái Modal Form |
| **Thêm cấu hình API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|P\|I\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Dùng trạng thái Modal Form |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|e\|e\|d\|b\|a\|c\|k\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng chi tiết gói tin** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|a\|c\|k\|a\|g\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|a\|c\|k\|a\|g\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|P\|a\|c\|k\|a\|g\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|P\|a\|c\|k\|a\|g\|e\|s\|(\|p\|a\|c\|k\|a\|g\|e\|s\|.\|f\|i\|l\|t\|e\|r\|(\|p\| \|=\|>\| \|p\|.\|i\|d\| \|!\|=\|=\| \|p\|a\|c\|k\|a\|g\|e\|T\|o\|D\|.\|.\|.\|` | ✅ Đóng/Mở Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|c\|o\|r\|d\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Đóng/Mở Modal |

---

# MODULE: SYSTEMADMINPAGE.TSX

### File: `SystemAdminPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **Người dùng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|u\|s\|e\|r\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Vai trò** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|o\|l\|e\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Nhóm người dùng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|g\|r\|o\|u\|p\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Danh sách chức năng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|f\|u\|n\|c\|t\|i\|o\|n\|s\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình chức năng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|f\|u\|n\|c\|t\|i\|o\|n\|-\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **Cấu hình** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Ngầm / Điều hướng |

---

# MODULE: USERGUIDEPAGE.TSX

### File: `UserGuidePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup |
|---|---|---|
| **{section.title}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|c\|t\|i\|o\|n\|(\|s\|e\|c\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Ngầm / Điều hướng |
| **s.id === selectedSection) === 0} className="flex i** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|c\|u\|r\|r\|e\|n\|t\|I\|n\|d\|e\|x\| \|=\| \|s\|e\|c\|t\|i\|o\|n\|s\|.\|f\|i\|n\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |
| **s.id === selectedSection) === sections.length - 1}** | `\|(\|)\| \|=\|>\| \|{\|\|
\| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \| \|c\|o\|n\|s\|t\| \|c\|u\|r\|r\|e\|n\|t\|I\|n\|d\|e\|x\| \|=\| \|s\|e\|c\|t\|i\|o\|n\|s\|.\|f\|i\|n\|.\|.\|.\|` | ℹ️ Action Ngầm / Điều hướng |

