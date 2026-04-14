# TÀI LIỆU RÀ SOÁT TÍNH NĂNG POPUP TRÊN TOÀN HỆ THỐNG

Tài liệu này đánh giá hiện trạng các nút chức năng (Xem, Sửa, Xóa, Thêm, Duyệt...) trên toàn bộ các Modun của hệ thống (Collection, Category, Master Data, v.v...)

## Ghi chú Trạng thái
- ✅ **Có Popup (Hoàn chỉnh)**: Thao tác mở Modal/Popup thành công (VD: `setShowEditModal(true)`).
- ℹ️ **Điều hướng / API Ngầm**: Các hành động chuyển trang (`navigate`), gọi submit API, tắt modal, hoặc xử lý state local.
- ❌ **Lỗi/Chưa có Popup Thực sự**: Các nút bấm gọi thẳng `alert(...)` tạm thời, hoặc CHƯA ĐƯỢC GẮN Hàm OnClick (Dead button), cần phải thiết kế thêm giao diện Modal cho chúng.

---

# MODULE: ADMIN

### File: `admin/AdminFunctionsList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Mở rộng tất cả** | `\|e\|x\|p\|a\|n\|d\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu gọn tất cả** | `\|c\|o\|l\|l\|a\|p\|s\|e\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isExpanded ? ( ) : ( )} {groupIndex + 1}. {group.** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|G\|r\|o\|u\|p\|(\|g\|r\|o\|u\|p\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/AccessLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/admin/AccountManagementLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/admin/BackupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{isBackingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}** | `\|h\|a\|n\|d\|l\|e\|B\|a\|c\|k\|u\|p\|N\|o\|w\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tải xuống** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|b\|a\|c\|k\|u\|p\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|b\|a\|c\|k\|u\|p\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|o\|p\|e\|n\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|b\|a\|c\|k\|u\|p\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa bản sao lưu** | `\|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|B\|a\|c\|k\|u\|p\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |

### File: `pages/admin/ConfigChangeLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nhật ký thay đổi cấu hình** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quản lý thời gian lưu trữ nhật ký** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|t\|e\|n\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/admin/ErrorLogPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|c\|l\|o\|s\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đánh dấu đã xử lý** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Copy Stack Trace** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/admin/FunctionListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|U\|s\|e\|r\|G\|r\|o\|u\|p\|(\|'\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ chức năn** | `\|h\|a\|n\|d\|l\|e\|S\|y\|n\|c\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/FunctionManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{isExpanded ? ( ) : ( )}** | `\|(\|e\|)\| \|=\|>\| \|{\| \|e\|.\|s\|t\|o\|p\|P\|r\|o\|p\|a\|g\|a\|t\|i\|o\|n\|(\|)\|;\| \|t\|o\|g\|g\|l\|e\|M\|e\|n\|u\|E\|x\|p\|a\|n\|s\|i\|o\|n\|(\|i\|t\|e\|m\|.\|i\|d\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|c\|r\|e\|a\|t\|e\|M\|e\|n\|u\|:\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|c\|r\|e\|a\|t\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|a\|c\|t\|i\|v\|e\|:\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|a\|c\|t\|i\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm quyền** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|'\|a\|d\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|'\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|'\|e\|d\|i\|t\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|'\|,\| \|p\|e\|r\|m\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|(\|p\|e\|r\|m\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Làm mới** | `\|h\|a\|n\|d\|l\|e\|R\|e\|f\|r\|e\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **{modalType === 'addPermission' ? 'Thêm mới' : 'Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/admin/GroupManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm nhóm mới** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|d\|d\|'\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|e\|d\|i\|t\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|d\|e\|l\|e\|t\|e\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|d\|e\|t\|a\|i\|l\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Thành viên** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|d\|d\|-\|m\|e\|m\|b\|e\|r\|s\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Phân quyền** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|s\|s\|i\|g\|n\|-\|f\|u\|n\|c\|t\|i\|o\|n\|s\|'\|,\| \|g\|r\|o\|u\|p\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Thêm thành viên** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|(\|)\|;\| \|s\|e\|t\|T\|i\|m\|e\|o\|u\|t\|(\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gán quyền** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|(\|)\|;\| \|s\|e\|t\|T\|i\|m\|e\|o\|u\|t\|(\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|(\|)\|;\| \|s\|e\|t\|T\|i\|m\|e\|o\|u\|t\|(\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **{modalType === 'add' ? 'Thêm nhóm' : 'Lưu thay đổi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa khỏi nhóm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa quyền** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Thêm {selectedUsers.length > 0 && `(${selectedUser** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu phân quyền** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa nhóm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/admin/LogRetentionConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm mới** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|o\|n\|f\|i\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|o\|n\|f\|i\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|c\|o\|n\|f\|i\|r\|m\|A\|d\|d\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Cập nhật** | `\|c\|o\|n\|f\|i\|r\|m\|E\|d\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|C\|o\|n\|f\|i\|r\|m\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|n\|u\|l\|l\|)\|.\|.\|.\|` | ℹ️ Đóng Modal |
| **Xóa** | `\|c\|o\|n\|f\|i\|r\|m\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/PasswordRuleConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đặt lại mặc định** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|T\|o\|D\|e\|f\|a\|u\|l\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu quy tắc** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|R\|u\|l\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|U\|p\|p\|e\|r\|c\|a\|s\|e\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|U\|p\|p\|e\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|L\|o\|w\|e\|r\|c\|a\|s\|e\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|L\|o\|w\|e\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|N\|u\|m\|b\|e\|r\|s\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|N\|u\|m\|b\|e\|r\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|S\|p\|e\|c\|i\|a\|l\|C\|h\|a\|r\|s\|'\|,\| \|!\|r\|u\|l\|e\|.\|r\|e\|q\|u\|i\|r\|e\|S\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu ngay** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|R\|u\|l\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/SecurityConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đặt lại mặc định** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|T\|o\|D\|e\|f\|a\|u\|l\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu cấu hình** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|C\|o\|n\|f\|i\|g\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|g\|C\|h\|a\|n\|g\|e\|(\|'\|r\|e\|q\|u\|i\|r\|e\|C\|h\|a\|n\|g\|e\|P\|a\|s\|s\|w\|o\|r\|d\|O\|n\|F\|i\|r\|s\|t\|L\|o\|g\|i\|n\|'\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|g\|C\|h\|a\|n\|g\|e\|(\|'\|e\|n\|a\|b\|l\|e\|W\|o\|r\|k\|i\|n\|g\|H\|o\|u\|r\|s\|R\|e\|s\|t\|r\|i\|c\|t\|i\|o\|n\|'\|,\| \|!\|c\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|g\|C\|h\|a\|n\|g\|e\|(\|'\|e\|n\|a\|b\|l\|e\|A\|u\|t\|o\|B\|a\|c\|k\|u\|p\|'\|,\| \|!\|c\|o\|n\|f\|i\|g\|.\|e\|n\|a\|b\|l\|e\|A\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu ngay** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|C\|o\|n\|f\|i\|g\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/StatisticsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tải biểu đồ** | `\|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|C\|h\|a\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem biểu đồ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|c\|h\|a\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem bảng dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|t\|a\|b\|l\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|o\|w\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |

### File: `pages/admin/SystemConfigPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đặt lại mặc định** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu cấu hình** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hàng ngày** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|b\|a\|c\|k\|u\|p\|S\|c\|h\|e\|d\|u\|l\|e\|'\|,\| \|'\|d\|a\|i\|l\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hàng tuần** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|b\|a\|c\|k\|u\|p\|S\|c\|h\|e\|d\|u\|l\|e\|'\|,\| \|'\|w\|e\|e\|k\|l\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hàng tháng** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|a\|n\|g\|e\|(\|'\|b\|a\|c\|k\|u\|p\|S\|c\|h\|e\|d\|u\|l\|e\|'\|,\| \|'\|m\|o\|n\|t\|h\|l\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/UserActivityHistoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{tab.icon} {tab.label}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|t\|a\|b\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Kết xuất** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|l\|o\|g\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/admin/UserManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đồng bộ người dùng** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|s\|y\|n\|c\|'\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nhập khẩu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|i\|m\|p\|o\|r\|t\|'\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xuất khẩu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|e\|x\|p\|o\|r\|t\|'\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **{user.groups.length} nhóm** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|U\|s\|e\|r\|(\|u\|s\|e\|r\|)\|;\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|a\|s\|s\|i\|g\|n\|-\|g\|r\|o\|u\|p\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|d\|e\|t\|a\|i\|l\|'\|,\| \|u\|s\|e\|r\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **{user.status === 'locked' ? : }** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|u\|s\|e\|r\|.\|s\|t\|a\|t\|u\|s\| \|=\|=\|=\| \|'\|l\|o\|c\|k\|e\|d\|'\| \|?\| \|'\|u\|n\|l\|o\|c\|k\|'\| \|:\| \|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đặt lại mật khẩu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|O\|p\|e\|n\|M\|o\|d\|a\|l\|(\|'\|r\|e\|s\|e\|t\|-\|p\|a\|s\|s\|w\|o\|r\|d\|'\|,\| \|u\|s\|e\|r\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Xuất khẩu** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|U\|s\|e\|r\|s\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đồng bộ ngay** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|L\|o\|g\|i\|c\| \|đ\|ồ\|n\|g\| \|b\|ộ\| \|n\|g\|ư\|ờ\|i\| \|d\|ù\|n\|g\| \|a\|l\|e\|r\|t\|(\|'\|Đ\|a\|n\|g\| \|đ\|ồ\|n\|g\| \|b\|ộ\| \|n\|g\|ư\|ờ\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **{modalType === 'add' ? 'Thêm người dùng' : 'Lưu th** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu thay đổi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa người dùng** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **{modalType === 'lock' ? 'Khóa tài khoản' : 'Mở khó** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: CATEGORY

### File: `category/SetupCategoryList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|c\|o\|d\|e\|:\| \|c\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|;\| \|s\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryApprovalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Trình duyệt danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **{tab === 'pending' && } {tab === 'approved' && } {** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|t\|a\|b\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|i\|e\|s\|(\|[\|]\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **{selectedCategories.length === filteredCategories.** | `\|h\|a\|n\|d\|l\|e\|S\|e\|l\|e\|c\|t\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|r\|e\|a\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|i\|e\|s\|(\|[\|]\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Trình duyệt ({selectedCategories.length})** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|S\|e\|l\|e\|c\|t\|e\|d\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|r\|e\|a\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|r\|e\|a\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Tạo và trình duyệt** | `\|h\|a\|n\|d\|l\|e\|C\|r\|e\|a\|t\|e\|A\|n\|d\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|i\|p\|i\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|i\|p\|i\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi trình duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Duyệt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Từ chối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cập nhật** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|-\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nhập từ Excel** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|I\|m\|p\|o\|r\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Thêm bản ghi mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Thêm cột mới** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa cấu trúc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|E\|d\|i\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Ngừng áp dụng bản ghi** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|r\|c\|h\|i\|v\|e\|M\|o\|d\|a\|l\|(\|t\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Phê duyệt hàng loạt** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối hàng loạt** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|R\|e\|j\|e\|c\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|A\|p\|p\|r\|o\|v\|a\|l\|D\|e\|t\|a\|i\|l\|(\|r\|e\|q\|u\|e\|s\|t\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|r\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|r\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|'\|'\|,\| \|d\|a\|t\|a\|T\|y\|p\|e\|:\| \|'\|T\|E\|X\|T\|'\|,\| \|r\|e\|q\|u\|i\|r\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|f\|i\|e\|l\|d\|.\|n\|a\|m\|e\|,\| \|d\|a\|t\|a\|T\|y\|p\|e\|:\| \|f\|i\|e\|l\|d\|.\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|(\|n\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|.\|f\|i\|l\|t\|e\|r\|(\|(\|_\|,\| \|i\|)\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu thay đổi** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|D\|i\|r\|e\|c\|t\| \|s\|a\|v\|e\| \|f\|o\|r\| \|u\|s\|e\|r\|s\| \|w\|i\|t\|h\| \|p\|e\|r\|m\|i\|s\|s\|i\|o\|n\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **a.id === editedCategoryData.approver); setSuccessN** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|V\|a\|l\|i\|d\|a\|t\|e\| \|a\|p\|p\|r\|o\|v\|e\|r\| \|s\|e\|l\|e\|c\|t\|i\|o\|n\| \|i\|f\| \|(\|!\|e\|d\|i\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|(\|[\|.\|.\|.\|n\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|,\| \|{\| \|.\|.\|.\|n\|e\|w\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **field.name.toLowerCase() === newFieldData.name.toL** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|V\|a\|l\|i\|d\|a\|t\|i\|o\|n\| \|c\|o\|n\|s\|t\| \|e\|r\|r\|o\|r\|s\|:\| \|{\| \|[\|k\|e\|y\|:\| \|s\|t\|r\|i\|n\|g\|]\|:\| \|s\|t\|r\|i\|n\|g\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|h\|a\|n\|d\|l\|e\|C\|a\|n\|c\|e\|l\|I\|m\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|a\|n\|c\|e\|l\|I\|m\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **0} className="px-4 py-2 bg-green-600 text-white ro** | `\|h\|a\|n\|d\|l\|e\|I\|m\|p\|o\|r\|t\|C\|o\|n\|f\|i\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|C\|o\|m\|m\|e\|n\|t\|(\|'\|'\|)\|;\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận phê duyệt** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|j\|e\|c\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|C\|o\|m\|m\|e\|n\|t\|(\|'\|'\|)\|;\| \|s\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận từ chối** | `\|c\|o\|n\|f\|i\|r\|m\|R\|e\|j\|e\|c\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng thông báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|c\|c\|e\|s\|s\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Xem thống kê** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Khôi phục phiên bản** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải xuống** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **So sánh** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo so sánh** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryPublishedListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|i\|t\|e\|m\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **×** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Tải {fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Tải xuống** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryPublishPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Cập nhật** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Công khai** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|C\|a\|t\|e\|g\|o\|r\|y\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|V\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategorySetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{tab.label}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|t\|a\|b\|.\|i\|d\| \|a\|s\| \|T\|a\|b\|T\|y\|p\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/CategorySetupPageNew.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Thêm cột mới** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|'\|'\|,\| \|d\|a\|t\|a\|T\|y\|p\|e\|:\| \|'\|T\|E\|X\|T\|'\|,\| \|r\|e\|q\|u\|i\|r\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|F\|i\|e\|l\|d\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|f\|i\|e\|l\|d\|.\|n\|a\|m\|e\|,\| \|d\|a\|t\|a\|T\|y\|p\|e\|:\| \|f\|i\|e\|l\|d\|.\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|(\|n\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|.\|f\|i\|l\|t\|e\|r\|(\|(\|_\|,\| \|i\|)\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Thêm trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|N\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|(\|[\|.\|.\|.\|n\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|F\|i\|e\|l\|d\|s\|,\| \|{\| \|.\|.\|.\|n\|e\|w\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|F\|o\|r\|m\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **field.name.toLowerCase() === newFieldData.name.toL** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|V\|a\|l\|i\|d\|a\|t\|i\|o\|n\| \|c\|o\|n\|s\|t\| \|e\|r\|r\|o\|r\|s\|:\| \|{\| \|[\|k\|e\|y\|:\| \|s\|t\|r\|i\|n\|g\|]\|:\| \|s\|t\|r\|i\|n\|g\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryStatisticsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Làm mới dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/CategoryStatisticsReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tìm kiếm và lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo phân loại** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thống kê lượt truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|c\|c\|e\|s\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|C\|a\|t\|e\|g\|o\|r\|y\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|F\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tạo báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tạo báo cáo phân loại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/category/components/modals/AttributeFormModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Hủy** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu tạm** | `\|o\|n\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu và Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|o\|n\|S\|a\|v\|e\|(\|)\|;\| \|o\|n\|S\|a\|v\|e\|A\|n\|d\|S\|u\|b\|m\|i\|t\|(\|{\| \|i\|d\|:\| \|f\|o\|r\|m\|D\|a\|t\|a\|.\|i\|d\| \||\||\| \|'\|n\|e\|w\|'\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/components/modals/RecordFormModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đóng modal** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isValidating ? ( <> Đang kiểm tra... ) : ( <> Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/components/tabs/ApprovalTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{tab.label}** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|T\|a\|b\|(\|t\|a\|b\|.\|k\|e\|y\|)\|;\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|l\|l\|'\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{tab.label} ({tab.count})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|t\|a\|b\|.\|k\|e\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|o\|n\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|q\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|o\|n\|A\|p\|p\|r\|o\|v\|e\|C\|l\|i\|c\|k\|(\|r\|e\|q\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|o\|n\|R\|e\|j\|e\|c\|t\|C\|l\|i\|c\|k\|(\|r\|e\|q\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cập nhật (1) {historyOpen ? '▲' : '▼'}** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|H\|i\|s\|t\|o\|r\|y\|(\|r\|e\|q\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/components/tabs/AttributesTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Lưu & trình duyệt** | `\|o\|n\|S\|a\|v\|e\|A\|n\|d\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm thuộc tính** | `\|o\|n\|A\|d\|d\|A\|t\|t\|r\|i\|b\|u\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/components/tabs/RelationshipsTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm quan hệ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|q\|u\|e\|s\|t\|D\|a\|t\|a\|(\|{\| \|i\|d\|:\| \|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|.\|i\|d\|,\| \|c\|o\|d\|e\|:\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu & trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|q\|u\|e\|s\|t\|D\|a\|t\|a\|(\|{\| \|i\|d\|:\| \|e\|d\|i\|t\|i\|n\|g\|R\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|?\|.\|i\|d\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{editingRelationship ? 'Lưu cập nhật' : 'Thêm quan** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/components/tabs/SetupTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm mới** | `\|o\|n\|A\|d\|d\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/category/components/tabs/VersionHistoryTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Lọc lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|(\|v\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Áp dụng bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: COLLECTION

### File: `collection/AddAPIMethodForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm header** | `\|a\|d\|d\|H\|e\|a\|d\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|H\|e\|a\|d\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm parameter** | `\|a\|d\|d\|P\|a\|r\|a\|m\|e\|t\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|P\|a\|r\|a\|m\|e\|t\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/AddConnectionForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isTesting ? 'Đang kiểm tra...' : 'Test kết nối'}** | `\|h\|a\|n\|d\|l\|e\|T\|e\|s\|t\|C\|o\|n\|n\|e\|c\|t\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu cấu hình** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/AddDataCollectionForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{category === 'external' && ( )} Thu thập từ Bộ ng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|a\|t\|e\|g\|o\|r\|y\|(\|'\|e\|x\|t\|e\|r\|n\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{category === 'internal' && ( )} Thu thập trong nộ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|a\|t\|e\|g\|o\|r\|y\|(\|'\|i\|n\|t\|e\|r\|n\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/AddDataSourceForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm header** | `\|a\|d\|d\|H\|e\|a\|d\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|H\|e\|a\|d\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm parameter** | `\|a\|d\|d\|P\|a\|r\|a\|m\|e\|t\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|P\|a\|r\|a\|m\|e\|t\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|h\|a\|n\|d\|l\|e\|C\|a\|n\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/APIMethodsList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm mới dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|D\|e\|p\|a\|r\|t\|m\|e\|n\|t\|F\|i\|l\|t\|e\|r\|(\|'\|'\|)\|;\| \|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|F\|i\|l\|t\|e\|r\|s\|(\|{\| \|d\|e\|p\|a\|r\|t\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|D\|a\|t\|a\|R\|e\|c\|o\|r\|d\|s\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|D\|a\|t\|a\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|d\|i\|t\|D\|a\|t\|a\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|l\|e\|t\|e\|D\|a\|t\|a\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/CategoryManagementDetail.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Metadata** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|t\|a\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình kết nối nguồn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử đồng bộ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa Metadata** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đồng bộ** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu cấu hình** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Test kết nối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Hủy** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/DataCollectionList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Import Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Thêm dữ liệu mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/DataManagementDetail.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình kết nối nguồn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử đồng bộ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|!\|s\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|i\|t\|e\|m\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Thêm kết nối** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|A\|p\|i\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|A\|p\|i\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|A\|p\|i\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đồng bộ** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đặt lại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kiểm tra** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu kết nối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kiểm tra kết nối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Làm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/EditAPIMethodForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm header** | `\|a\|d\|d\|H\|e\|a\|d\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|H\|e\|a\|d\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm parameter** | `\|a\|d\|d\|P\|a\|r\|a\|m\|e\|t\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|P\|a\|r\|a\|m\|e\|t\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu thay đổi** | `\|o\|n\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/EditDataCollectionForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/NotificationManagement.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Gửi lại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Download** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu cấu hình** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/OverviewCombined.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm nguồn dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Bắt đầu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Cài đặt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/SendDataForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **API REST Gửi qua API endpoint** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|M\|e\|t\|h\|o\|d\|(\|'\|a\|p\|i\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Upload File Tải lên file dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|M\|e\|t\|h\|o\|d\|(\|'\|f\|i\|l\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **SFTP Truyền qua SFTP server** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|M\|e\|t\|h\|o\|d\|(\|'\|s\|f\|t\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|r\|r\|o\|r\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|r\|r\|o\|r\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Test kết nối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem log** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải lên và gửi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải template mẫu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Gửi qua SFTP** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Gửi lại dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem log đầy đủ** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Báo cáo lỗi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/ValidationDetailsModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|o\|w\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|M\|a\|t\|h\|.\|m\|a\|x\|(\|1\|,\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **= totalPages} className="p-2 border border-slate-3** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|M\|a\|t\|h\|.\|m\|i\|n\|(\|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\|,\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|+\| \|1\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|o\|w\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `collection/ViewAPIMethodDetail.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|o\|n\|E\|d\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/ViewDataCollectionDetail.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{ e.currentTarget.style.backgroundColor = category** | `\|o\|n\|E\|d\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `collection/ViewDataRecordsList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút điều khiển tự do (Icon)** | `\|o\|n\|B\|a\|c\|k\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|F\|i\|l\|t\|e\|r\|s\|(\|{\| \|d\|e\|p\|a\|r\|t\|m\|e\|n\|t\|:\| \|'\|'\|,\| \|d\|a\|t\|a\|T\|y\|p\|e\|:\| \|'\|'\|,\| \|f\|r\|e\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **10** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/collection/CollectionSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|r\|v\|i\|c\|e\|-\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quản lý nhật ký** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ lọc** | `\|r\|e\|s\|e\|t\|F\|i\|l\|t\|e\|r\|s\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm dịch vụ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|S\|e\|r\|v\|i\|c\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Kết xuất danh sách** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|e\|r\|v\|i\|c\|e\|L\|i\|s\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{service.statusText}** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|r\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|S\|e\|r\|v\|i\|c\|e\|M\|o\|d\|a\|l\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Cài đặt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|t\|t\|i\|n\|g\|s\|M\|o\|d\|a\|l\|(\|t\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Trước** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|>\| \|1\| \|?\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\| \|:\| \|c\|u\|r\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sau** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\| \|=\| \|M\|a\|t\|h\|.\|c\|e\|i\|l\|(\|f\|i\|l\|t\|e\|r\|e\|d\|S\|e\|r\|v\|i\|c\|e\|s\|.\|l\|e\|n\|g\|t\|h\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|>\| \|1\| \|?\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\| \|:\| \|c\|u\|r\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\| \|=\| \|M\|a\|t\|h\|.\|c\|e\|i\|l\|(\|f\|i\|l\|t\|e\|r\|e\|d\|S\|e\|r\|v\|i\|c\|e\|s\|.\|l\|e\|n\|g\|t\|h\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|r\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|r\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi thông báo hệ thống nguồn** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|n\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|T\|o\|S\|o\|u\|r\|c\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/collection/ExternalDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm nguồn mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đồng bộ ngay** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/collection/InternalDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem chi tiết hồ sơ nguồn** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|o\|u\|r\|c\|e\|(\|s\|o\|u\|r\|c\|e\|)\|;\| \|s\|e\|t\|I\|s\|D\|o\|c\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Thêm nguồn mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Làm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đồng bộ ngay** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/collection/LogManagement.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Lịch sử truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|L\|o\|g\|T\|a\|b\|(\|'\|a\|c\|c\|e\|s\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử hoạt động** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|L\|o\|g\|T\|a\|b\|(\|'\|a\|c\|t\|i\|v\|i\|t\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thông tin khác** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|L\|o\|g\|T\|a\|b\|(\|'\|o\|t\|h\|e\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Kết xuất** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|L\|o\|g\|s\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|L\|o\|g\|(\|l\|o\|g\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|L\|o\|g\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|L\|o\|g\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |

### File: `pages/collection/ServiceDataDetailPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Kết xuất** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem hồ sơ gốc (Phiếu ý kiến)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|C\|o\|d\|e\|(\|r\|e\|c\|o\|r\|d\|.\|r\|e\|c\|o\|r\|d\|I\|d\|)\|;\| \|s\|e\|t\|I\|s\|D\|o\|c\|M\|o\|d\|a\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Trang trước** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|p\|r\|e\|v\| \|=\|>\| \|M\|a\|t\|h\|.\|m\|a\|x\|(\|1\|,\| \|p\|r\|e\|v\| \|-\| \|1\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Trang sau** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|p\|r\|e\|v\| \|=\|>\| \|M\|a\|t\|h\|.\|m\|i\|n\|(\|t\|o\|t\|a\|l\|P\|a\|g\|e\|s\|,\| \|p\|r\|e\|v\| \|+\| \|1\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/collection/ServiceDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem văn bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|o\|c\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |

---

# MODULE: COMMON

### File: `common/APIConnectionFormModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Add Header** | `\|a\|d\|d\|H\|e\|a\|d\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|H\|e\|a\|d\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Add Query Param** | `\|a\|d\|d\|Q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|Q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Test Kết nối** | `\|h\|a\|n\|d\|l\|e\|T\|e\|s\|t\|C\|o\|n\|n\|e\|c\|t\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isViewMode ? 'Đóng' : 'Hủy'}** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `common/DataDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nguồn dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|o\|u\|r\|c\|e\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Dữ liệu đã gộp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|r\|g\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isExpanded ? ( ) : ( )} {source.name} {Object.key** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|S\|o\|u\|r\|c\|e\|(\|s\|o\|u\|r\|c\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|o\|n\|E\|d\|i\|t\|(\|d\|a\|t\|a\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi duyệt** | `\|(\|)\| \|=\|>\| \|o\|n\|S\|u\|b\|m\|i\|t\|F\|o\|r\|A\|p\|p\|r\|o\|v\|a\|l\|(\|d\|a\|t\|a\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `common/ErrorDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|c\|s\|v\| \|=\| \|[\| \|[\|'\|S\|T\|T\|'\|,\| \|'\|I\|D\| \|B\|ả\|n\| \|g\|h\|i\|'\|,\| \|'\|T\|r\|ư\|ờ\|n\|g\| \|d\|ữ\| \|l\|i\|ệ\|u\|'\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `common/GenericDataTable.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Nhập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|I\|m\|p\|o\|r\|t\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xuất** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đồng bộ** | `\|o\|n\|S\|y\|n\|c\|` | ℹ️ Action Nội bộ / Điều hướng |
| **×** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|n\|e\|w\|F\|i\|l\|t\|e\|r\|s\| \|=\| \|{\| \|.\|.\|.\|f\|i\|l\|t\|e\|r\|s\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|s\|(\|{\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Trước** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{pageNum}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|p\|a\|g\|e\|N\|u\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sau** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|+\| \|1\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `common/SyncHistoryTable.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{record.recordsFailed}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|r\|r\|o\|r\|C\|l\|i\|c\|k\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem tất cả** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Làm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `common/TabView.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{Icon && } {tab.label} {tab.count !== undefined &&** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|t\|a\|b\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: DASHBOARD

### File: `dashboard/ChartDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lọc thời gian** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Bộ lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `dashboard/DataQualityDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bộ lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATA-COLLECTION

### File: `data-collection/DataFileList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem bảng dữ liệu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|T\|a\|b\|l\|e\|(\|f\|i\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{file.dataType}** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **{file.nextStep}** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kiểm tra ngay** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem log** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `data-collection/DataTableViewer.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|M\|a\|t\|h\|.\|m\|a\|x\|(\|1\|,\| \|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|-\| \|1\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\|(\|c\|u\|r\|r\|e\|n\|t\|P\|a\|g\|e\| \|+\| \|1\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATADETAILMODAL.TSX

### File: `DataDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **📋 Danh sách đối tượng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **🕐 Lịch sử đồng bộ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|!\|s\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Xem** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|P\|d\|f\|U\|r\|l\|(\|r\|e\|c\|o\|r\|d\|.\|p\|d\|f\|U\|r\|l\|!\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **👤 Người được khai sinh** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|p\|e\|r\|s\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **👨 Thông tin Cha** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|f\|a\|t\|h\|e\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **👩 Người mẹ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|m\|o\|t\|h\|e\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **📋 Thông tin khác** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|o\|t\|h\|e\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chi tiết hồ sơ đính kèm.pdf Nhấn để xem trực tiếp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|P\|d\|f\|U\|r\|l\|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|.\|p\|d\|f\|U\|r\|l\|!\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng trình xem** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|P\|d\|f\|U\|r\|l\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trang trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trang sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất file** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **−** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **+** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: MARRIAGEDETAILMODAL.TSX

### File: `MarriageDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách ({totalRecords.toLocaleString()})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử đồng bộ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|y\|n\|c\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lọc nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|!\|s\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **📄 Thông tin hồ sơ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|r\|e\|c\|o\|r\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **👨 Bên chồng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|h\|u\|s\|b\|a\|n\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **👩 Bên vợ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|w\|i\|f\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **📋 Thông tin khác** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|D\|e\|t\|a\|i\|l\|T\|a\|b\|(\|'\|o\|t\|h\|e\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Làm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trang 1 / 2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đóng** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất file** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: MASTERDATA

### File: `masterdata/AttributeManagementModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm thuộc tính mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|a\|t\|t\|r\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|a\|t\|t\|r\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: MODALS

### File: `modals/NotificationDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi lại thông báo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `modals/RequestDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|o\|n\|A\|p\|p\|r\|o\|v\|e\|(\|r\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|;\| \|o\|n\|C\|l\|o\|s\|e\|(\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bắt đầu xử lý** | `\|(\|)\| \|=\|>\| \|{\| \|o\|n\|P\|r\|o\|c\|e\|s\|s\|(\|r\|e\|q\|u\|e\|s\|t\|.\|i\|d\|)\|;\| \|o\|n\|C\|l\|o\|s\|e\|(\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tải xuống** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `modals/ServiceDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|o\|n\|A\|p\|p\|r\|o\|v\|e\|)\| \|o\|n\|A\|p\|p\|r\|o\|v\|e\|(\|s\|e\|r\|v\|i\|c\|e\|.\|i\|d\|)\|;\| \|o\|n\|C\|l\|o\|s\|e\|(\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|o\|n\|R\|e\|j\|e\|c\|t\|)\| \|o\|n\|R\|e\|j\|e\|c\|t\|(\|s\|e\|r\|v\|i\|c\|e\|.\|i\|d\|)\|;\| \|o\|n\|C\|l\|o\|s\|e\|(\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai dịch vụ** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|o\|n\|P\|u\|b\|l\|i\|s\|h\|)\| \|o\|n\|P\|u\|b\|l\|i\|s\|h\|(\|s\|e\|r\|v\|i\|c\|e\|.\|i\|d\|)\|;\| \|o\|n\|C\|l\|o\|s\|e\|(\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đình chỉ dịch vụ** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|o\|n\|S\|u\|s\|p\|e\|n\|d\|)\| \|o\|n\|S\|u\|s\|p\|e\|n\|d\|(\|s\|e\|r\|v\|i\|c\|e\|.\|i\|d\|)\|;\| \|o\|n\|C\|l\|o\|s\|e\|(\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: CATEGORYMANAGEMENTPAGE.TSX

### File: `pages/CategoryManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt danh mục {stats.pending > 0 && ( {stats.** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công bố danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo & Tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công bố danh mục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem dữ liệu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng danh mục {stats.total}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã phê duyệt {stats.approved}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ phê duyệt {stats.pending}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nháp {stats.draft}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|d\|r\|a\|f\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối {stats.rejected}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã công bố {stats.published}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|s\|h\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem danh mục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đề xuất công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|r\|o\|p\|o\|s\|e\|P\|u\|b\|l\|i\|s\|h\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|r\|e\|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|h\|a\|n\|d\|l\|e\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa điều kiện** | `\|r\|e\|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Gửi yêu cầu phê duyệt** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận công bố** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|a\|t\|e\|g\|o\|r\|y\|D\|a\|t\|a\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xuất dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: CATEGORYMANAGEMENTPAGE_BACKUP.TSX

---

# MODULE: DATACLEANINGMANAGEMENTPAGE.TSX

### File: `pages/DataCleaningManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem tất cả tác vụ trong ngành** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem tất cả tác vụ ngoài ngành** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATACOLLECTIONFILESPAGE.TSX

### File: `pages/DataCollectionFilesPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã tiếp nhận** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|r\|e\|c\|e\|i\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hoàn tất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|c\|o\|m\|p\|l\|e\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất danh sách** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải file lên** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lọc nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trang trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **2** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **3** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trang sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATACOLLECTIONPAGE.TSX

### File: `pages/DataCollectionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tổng quan** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|o\|v\|e\|r\|v\|i\|e\|w\|-\|c\|o\|m\|b\|i\|n\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách thu thập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|o\|v\|e\|r\|v\|i\|e\|w\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nhận dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|r\|e\|c\|e\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|s\|e\|n\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nhật ký** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|c\|t\|i\|v\|i\|t\|y\|-\|l\|o\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: DATACOORDINATIONPAGE.TSX

### File: `pages/DataCoordinationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quản lý API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|i\|-\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cung cấp thụ động {stats.pendingRequests > 0 && (** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|a\|s\|s\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Giám sát** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|m\|o\|n\|i\|t\|o\|r\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh mục dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|c\|a\|t\|a\|l\|o\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đăng ký dịch vụ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|S\|e\|r\|v\|i\|c\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Tổng dịch vụ {stats.totalServices}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang hoạt động {stats.activeServices}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ phê duyệt {stats.pendingServices}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|E\|d\|i\|t\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|S\|e\|r\|v\|i\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|D\|o\|c\|s\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|o\|c\|u\|m\|e\|n\|t\|a\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|S\|t\|a\|t\|s\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|t\|a\|t\|i\|s\|t\|i\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|C\|o\|n\|f\|i\|g\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Tạo yêu cầu mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|q\|u\|e\|s\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Bắt ầu xử lý** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|P\|r\|o\|c\|e\|s\|s\|R\|e\|q\|u\|e\|s\|t\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|F\|o\|r\|D\|e\|t\|a\|i\|l\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|q\|u\|e\|s\|t\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **{expandedErrorLog === idx ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|E\|r\|r\|o\|r\|L\|o\|g\|(\|e\|x\|p\|a\|n\|d\|e\|d\|E\|r\|r\|o\|r\|L\|o\|g\| \|=\|=\|=\| \|i\|d\|x\| \|?\| \|n\|u\|l\|l\| \|:\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã gửi** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|l\|o\|g\|.\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{dept.department} {dept.services.length} dịch vụ {** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|D\|e\|p\|a\|r\|t\|m\|e\|n\|t\|(\|d\|e\|p\|t\|.\|d\|e\|p\|a\|r\|t\|m\|e\|n\|t\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Copy mã dịch vụ** | `\|(\|)\| \|=\|>\| \|{\| \|n\|a\|v\|i\|g\|a\|t\|o\|r\|.\|c\|l\|i\|p\|b\|o\|a\|r\|d\|.\|w\|r\|i\|t\|e\|T\|e\|x\|t\|(\|s\|e\|r\|v\|i\|c\|e\|.\|c\|o\|d\|e\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem tài liệu API** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|F\|o\|r\|D\|o\|c\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|P\|I\|D\|o\|c\|M\|o\|d\|a\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Phê duyệt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Từ chối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải xuống** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATAPROCESSINGPAGE.TSX

---

# MODULE: DATARECONCILIATIONPAGE.TSX

### File: `pages/DataReconciliationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{reconcilingId === item.id ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|o\|n\|f\|i\|r\|m\|R\|e\|c\|o\|n\|c\|i\|l\|e\|I\|d\|(\|i\|t\|e\|m\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|o\|n\|f\|i\|r\|m\|R\|e\|c\|o\|n\|c\|i\|l\|e\|I\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xác nhận đối soát** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|r\|t\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi thông báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|n\|c\|i\|l\|i\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATASEARCHPAGE.TSX

### File: `pages/DataSearchPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Dữ liệu chủ Tra cứu dữ liệu chủ của hệ thống 2,847** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|y\|p\|e\|(\|'\|m\|a\|s\|t\|e\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Dữ liệu mở Tra cứu dữ liệu công khai 1,234,567 bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|y\|p\|e\|(\|'\|o\|p\|e\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Dữ liệu dùng chung Tra cứu dữ liệu được chia sẻ 89** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|y\|p\|e\|(\|'\|s\|h\|a\|r\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đặt lại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: DATASHARINGPAGE.TSX

### File: `pages/DataSharingPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem tất cả** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: EXTERNAL

### File: `pages/external/CategoryGroupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/external/ChildrenGroupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/external/CivilRegistryDatabasePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Chọn ngày** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/external/CourtJudgmentPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/external/MeritoriousGroupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/external/SocialSecurityGroupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: INTERNAL

### File: `pages/internal/AuctionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/CaseManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/CivilJudgmentPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/CivilLegalCenterPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/CivilLegalInfoPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/FamilyBasePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/InternationalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/LegalNationalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/SecurityMeasuresPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/internal/StatisticsCollectionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kết xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: LOGINPAGE.TSX

### File: `pages/LoginPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{showPassword ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|a\|s\|s\|w\|o\|r\|d\|(\|!\|s\|h\|o\|w\|P\|a\|s\|s\|w\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: MASTER-DATA

### File: `pages/master-data/ApprovalTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tất cả ({records.length})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ phê duyệt ({pendingCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã phê duyệt ({approvedCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối ({rejectedCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cập nhật ({record.history.length}) {isExpa** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|H\|i\|s\|t\|o\|r\|y\|(\|i\|s\|E\|x\|p\|a\|n\|d\|e\|d\| \|?\| \|n\|u\|l\|l\| \|:\| \|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hành động** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hành động** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|F\|o\|r\|m\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|F\|o\|r\|m\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **{approvalAction === 'approve' ? ( <> Xác nhận phê** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/master-data/AttributesManagementTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{selectedEntityData ? ( {selectedEntityData.code}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|o\|m\|b\|o\|b\|o\|x\|O\|p\|e\|n\|(\|!\|c\|o\|m\|b\|o\|b\|o\|x\|O\|p\|e\|n\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{entity.code} - {entity.name} {selectedEntity ===** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|E\|n\|t\|i\|t\|y\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|;\| \|s\|e\|t\|C\|o\|m\|b\|o\|b\|o\|x\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm thuộc tính** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **v{attribute.version}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|H\|i\|s\|t\|o\|r\|y\|(\|a\|t\|t\|r\|i\|b\|u\|t\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|a\|t\|t\|r\|i\|b\|u\|t\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|a\|t\|t\|r\|i\|b\|u\|t\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{editingAttribute ? 'Cập nhật' : 'Tạo mới'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|H\|i\|s\|t\|o\|r\|y\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|H\|i\|s\|t\|o\|r\|y\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |

### File: `pages/master-data/EntityRelationshipsTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm quan hệ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{editingRelationship ? 'Cập nhật' : 'Lưu quan hệ'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/master-data/HistoryTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **📋 Danh sách** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **📅 Timeline** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|M\|o\|d\|e\|(\|'\|t\|i\|m\|e\|l\|i\|n\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết bản ghi** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|(\|{\| \|r\|e\|c\|o\|r\|d\|C\|o\|d\|e\|:\| \|r\|e\|c\|o\|r\|d\|.\|r\|e\|c\|o\|r\|d\|C\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **So sánh với phiên bản {selectedHistory[index - 1].** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|C\|o\|m\|p\|a\|r\|e\|V\|e\|r\|s\|i\|o\|n\|s\|(\|{\| \|v\|1\|:\| \|i\|t\|e\|m\|.\|v\|e\|r\|s\|i\|o\|n\|,\| \|v\|2\|:\| \|s\|e\|l\|e\|c\|t\|e\|d\|H\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Khôi phục version này** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|R\|e\|s\|t\|o\|r\|e\|R\|e\|c\|o\|r\|d\|C\|o\|d\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|C\|o\|d\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|m\|p\|a\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|C\|o\|m\|p\|a\|r\|e\|V\|e\|r\|s\|i\|o\|n\|s\|(\|n\|u\|l\|l\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **📅 Xem Timeline** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|T\|i\|m\|e\|l\|i\|n\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|.\|r\|e\|c\|o\|r\|d\|C\|o\|d\|e\|)\|;\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|e\|t\|a\|i\|l\|R\|e\|c\|o\|r\|d\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|s\|t\|o\|r\|e\|R\|e\|c\|o\|r\|d\|C\|o\|d\|e\|(\|'\|'\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|s\|t\|o\|r\|e\|R\|e\|c\|o\|r\|d\|C\|o\|d\|e\|(\|'\|'\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **h.version === selectedRestoreVersion)?.date}` ); s** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|c\|o\|n\|f\|i\|r\|m\|e\|d\| \|=\| \|w\|i\|n\|d\|o\|w\|.\|c\|o\|n\|f\|i\|r\|m\|(\| \|`\|♻\|️\| \|X\|Á\|C\| \|N\|H\|Ậ\|N\| \|K\|H\|Ô\|I\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/MasterDataAPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|V\|u\|i\| \|l\|ò\|n\|g\| \|c\|h\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|V\|u\|i\| \|l\|ò\|n\|g\| \|c\|h\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Hủy công khai** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|V\|u\|i\| \|l\|ò\|n\|g\| \|c\|h\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Khôi phục** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|(\|n\|e\|w\| \|S\|e\|t\|(\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{getApprovalStatusText(record.approvalStatus)}** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|r\|e\|c\|o\|r\|d\|.\|a\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|u\|s\| \|=\|=\|=\| \|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chi tiết nguồn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|(\|'\|'\|)\|;\| \|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|(\|'\|'\|)\|;\| \|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi phê duyệt ngay** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|!\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|⚠\|️\| \|V\|u\|i\| \|l\|ò\|n\|g\| \|c\|h\|ọ\|n\| \|n\|g\|ư\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **{ const selectedData = data.filter(r => selectedRe** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy công khai ngay** | `\|(\|)\| \|=\|>\| \|{\| \|h\|a\|n\|d\|l\|e\|U\|n\|p\|u\|b\|l\|i\|s\|h\|(\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **✕ Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|s\|t\|o\|r\|e\|R\|e\|c\|o\|r\|d\|s\|(\|[\|]\|)\|;\| \|s\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **v{version} {version === 4 && '25/12/2024'} {versio** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|n\|e\|w\|V\|e\|r\|s\|i\|o\|n\|s\| \|=\| \|n\|e\|w\| \|M\|a\|p\|(\|s\|e\|l\|e\|c\|t\|e\|d\|R\|e\|s\|t\|o\|r\|e\|V\|e\|r\|s\|i\|o\|n\|s\|)\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|s\|t\|o\|r\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|s\|t\|o\|r\|e\|R\|e\|c\|o\|r\|d\|s\|(\|[\|]\|)\|;\| \|s\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Khôi phục ngay** | `\|(\|)\| \|=\|>\| \|{\| \|l\|e\|t\| \|s\|u\|m\|m\|a\|r\|y\| \|=\| \|'\|♻\|️\| \|X\|Á\|C\| \|N\|H\|Ậ\|N\| \|K\|H\|Ô\|I\| \|P\|H\|Ụ\|C\| \|P\|H\|I\|Ê\|N\| \|B\|Ả\|N\|\|n\|\|n\|'\|;\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Trước** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **1** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sau** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lịch sử chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/MasterDataApprovalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Trình duyệt mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Chờ duyệt ({stats.pending})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã duyệt ({stats.approved})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối ({stats.rejected})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tất cả ({stats.total})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|a\|p\|p\|r\|o\|v\|a\|l\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Gửi trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|a\|p\|p\|r\|o\|v\|a\|l\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|a\|p\|p\|r\|o\|v\|a\|l\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\|(\|'\|a\|p\|p\|r\|o\|v\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|a\|p\|p\|r\|o\|v\|a\|l\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\|(\|'\|r\|e\|j\|e\|c\|t\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|i\|p\|i\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|i\|p\|i\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi trình duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **{approvalType === 'approve' ? : } {approvalType ==** | `\|(\|)\| \|=\|>\| \|{\| \|a\|l\|e\|r\|t\|(\|`\|Đ\|ã\| \|$\|{\|a\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\| \|=\|=\|=\| \|'\|a\|p\|p\|r\|o\|v\|e\|'\| \|?\| \|'\|p\|h\|ê\| \|d\|u\|y\|ệ\|t\|'\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |

### File: `pages/master-data/MasterDataManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Quản lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tra cứu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm dữ liệu mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đặt lại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/MasterDataPublishPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Gỡ công khai** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|(\|d\|a\|t\|a\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|(\|d\|a\|t\|a\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Gỡ công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xem** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đồng bộ** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/MasterDataReportsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tra cứu dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo sử dụng dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|u\|s\|a\|g\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo vòng đời dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|f\|e\|c\|y\|c\|l\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|s\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Xóa bộ lọc** | `\|h\|a\|n\|d\|l\|e\|R\|e\|s\|e\|t\|F\|i\|l\|t\|e\|r\|s\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|h\|a\|n\|d\|l\|e\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hiển thị bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|l\|t\|e\|r\|s\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **In** | `\|h\|a\|n\|d\|l\|e\|P\|r\|i\|n\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/master-data/MasterDataScaleManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập DL chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thiết lập thuộc tính** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|t\|t\|r\|i\|b\|u\|t\|e\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thiết lập quy tắc hợp nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|r\|g\|e\|-\|r\|u\|l\|e\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thiết lập quan hệ thực thể** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quy tắc định danh duy nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|i\|d\|e\|n\|t\|i\|f\|i\|e\|r\|-\|r\|u\|l\|e\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tạo mới (Wizard 5 bước)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|W\|i\|z\|a\|r\|d\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Thêm mới nhanh** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Nút bấm** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|e\|n\|t\|i\|t\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút bấm** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút bấm** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{editingEntity ? 'Cập nhật' : 'Tạo mới'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/master-data/MasterDataSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm cấu hình mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|;\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|c\|o\|n\|f\|i\|g\|)\|;\| \|s\|e\|t\|S\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Cập nhật** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |

### File: `pages/master-data/MasterDataUpdateReviewTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi phê duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai** | `\|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|s\|(\|n\|e\|w\| \|S\|e\|t\|(\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/MasterDataUpdateTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Rà soát** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|r\|e\|v\|i\|e\|w\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Theo dõi lịch sử thay đổi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quản lý phiên bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|u\|b\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isExpanded ? : }** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|H\|i\|s\|t\|o\|r\|y\|(\|i\|s\|E\|x\|p\|a\|n\|d\|e\|d\| \|?\| \|n\|u\|l\|l\| \|:\| \|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{record.visibility === 'public' ? ( <> Công khai )** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|V\|i\|s\|i\|b\|i\|l\|i\|t\|y\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gỡ công khai** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|v\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|v\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **{reviewAction === 'approve' ? ( <> Xác nhận phê du** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|R\|e\|v\|i\|e\|w\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Kích hoạt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/MergeRulesManagementTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm quy tắc mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Kiểm thử** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|T\|e\|s\|t\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|T\|o\|g\|g\|l\|e\|S\|t\|a\|t\|u\|s\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm nguồn** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|S\|o\|u\|r\|c\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Xóa (Icon Trash)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|S\|o\|u\|r\|c\|e\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm quy tắc so khớp** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|M\|a\|t\|c\|h\|R\|u\|l\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Xóa (Icon Trash)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|M\|a\|t\|c\|h\|R\|u\|l\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm quy tắc trích rút** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|E\|x\|t\|r\|a\|c\|t\|R\|u\|l\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Xóa (Icon Trash)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|E\|x\|t\|r\|a\|c\|t\|R\|u\|l\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{editingRule ? 'Cập nhật' : 'Lưu quy tắc'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|T\|e\|s\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|T\|e\|s\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Bắt đầu kiểm thử** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data/UniqueIdentifierRulesTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm quy tắc mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|o\|r\|m\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Sao chép** | `\|(\|)\| \|=\|>\| \|c\|o\|p\|y\|T\|o\|C\|l\|i\|p\|b\|o\|a\|r\|d\|(\|r\|u\|l\|e\|.\|e\|x\|a\|m\|p\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Làm mới** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|F\|o\|r\|m\|C\|h\|a\|n\|g\|e\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sao chép** | `\|(\|)\| \|=\|>\| \|c\|o\|p\|y\|T\|o\|C\|l\|i\|p\|b\|o\|a\|r\|d\|(\|g\|e\|n\|e\|r\|a\|t\|e\|d\|E\|x\|a\|m\|p\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{duplicateCheck.checking ? 'Đang kiểm tra...' : 'K** | `\|h\|a\|n\|d\|l\|e\|C\|h\|e\|c\|k\|D\|u\|p\|l\|i\|c\|a\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|l\|o\|s\|e\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{editingRule ? 'Cập nhật' : 'Lưu quy tắc'}** | `\|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: MASTER-DATA-LIST

### File: `pages/master-data-list/MasterDataListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng dữ liệu chủ {masterData.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang hoạt động {masterData.filter(c => c.isActive)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Dữ liệu chuẩn {masterData.filter(c => c.dataType =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Dữ liệu tham chiếu {masterData.filter(c => c.dataT** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|f\|e\|r\|e\|n\|c\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|S\|e\|a\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ duyệt {approvalRequests.filter(r => r.status =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã duyệt {approvalRequests.filter(r => r.status ==** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối {approvalRequests.filter(r => r.status ===** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|y\|p\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng dữ liệu đã công khai {publishedMasterData.len** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai {publishedMasterData.filter(d => d.statu** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|c\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Riêng tư {publishedMasterData.filter(d => d.status** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|r\|i\|v\|a\|t\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm dữ liệu chủ mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Gửi phê duyệt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Phê duyệt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Từ chối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/master-data-list/MasterDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Tổng số bản ghi {totalItems}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang hoạt động {activeItems}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Ngừng hoạt động {inactiveItems}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|i\|n\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|e\|r\|m\|(\|'\|'\|)\|;\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|l\|l\|'\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{expandedRows.has(item.id) ? ( ) : ( )}** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|R\|o\|w\|E\|x\|p\|a\|n\|d\|(\|i\|t\|e\|m\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Import** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Export** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: MASTERDATAPAGE.TSX

### File: `pages/MasterDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quản lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt {stats.review > 0 && ( {stats.review} )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai {stats.approved > 0 && ( {stats.approved** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tra cứu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thiết lập dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Quản lý thuộc tính** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|t\|t\|r\|i\|b\|u\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Quy tắc hợp nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|M\|e\|r\|g\|e\|R\|u\|l\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Quan hệ thực thể** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|l\|a\|t\|i\|o\|n\|s\|h\|i\|p\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Định danh duy nhất** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|I\|d\|e\|n\|t\|i\|f\|i\|e\|r\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|E\|n\|t\|i\|t\|y\|(\|e\|n\|t\|i\|t\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|e\|n\|t\|i\|t\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cập nhật bản ghi** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|e\|n\|t\|i\|t\|y\|.\|i\|s\|L\|o\|c\|k\|e\|d\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|D\|ữ\| \|l\|i\|ệ\|u\| \|c\|h\|ủ\| \|đ\|a\|n\|g\| \|b\|ị\| \|k\|h\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Quản lý phiên bản** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|E\|n\|t\|i\|t\|y\|(\|e\|n\|t\|i\|t\|y\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|R\|e\|v\|i\|e\|w\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Mở khóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|U\|n\|l\|o\|c\|k\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Khóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|L\|o\|c\|k\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|s\|t\|o\|r\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu trữ** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|r\|c\|h\|i\|v\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy công khai** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|U\|n\|p\|u\|b\|l\|i\|s\|h\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai dữ liệu chủ** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|v\|o\|k\|e\|A\|p\|p\|r\|o\|v\|a\|l\|(\|e\|n\|t\|i\|t\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|E\|n\|t\|i\|t\|y\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đặt lại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tra cứu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: NEW-CATEGORY

### File: `pages/new-category/NewCategorySetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng danh mục {categories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang hoạt động {categories.filter(c => c.isActive)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh mục chuẩn {categories.filter(c => c.dataType** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh mục tham chiếu {categories.filter(c => c.data** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|f\|e\|r\|e\|n\|c\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|S\|e\|a\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ duyệt {approvalRequests.filter(r => r.status =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã duyệt {approvalRequests.filter(r => r.status ==** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối {approvalRequests.filter(r => r.status ===** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|y\|p\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng đã công khai {publishedCategories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang công khai {publishedCategories.filter(c => c.** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|c\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|P\|u\|b\|l\|i\|s\|h\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm danh mục mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Cài đặt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Gỡ công khai** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa bộ lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất PDF** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất CSV** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem thống kê** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: NOTIFICATIONPAGE.TSX

### File: `pages/NotificationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chưa đọc ({unreadCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|u\|n\|r\|e\|a\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã đọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|r\|e\|a\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đánh dấu đã đọc** | `\|(\|)\| \|=\|>\| \|m\|a\|r\|k\|A\|s\|R\|e\|a\|d\|(\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|d\|e\|l\|e\|t\|e\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đánh dấu đã đọc** | `\|(\|)\| \|=\|>\| \|{\| \|m\|a\|r\|k\|A\|s\|R\|e\|a\|d\|(\|s\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|.\|i\|d\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|N\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: OPEN-DATA

### File: `pages/open-data/OpenDataApprovalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Trình duyệt mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Chờ duyệt ({stats.pending})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã phê duyệt ({stats.approved})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối ({stats.rejected})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tất cả ({stats.total})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Gửi trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\|(\|'\|a\|p\|p\|r\|o\|v\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|q\|u\|e\|s\|t\|(\|r\|e\|q\|u\|e\|s\|t\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\|(\|'\|r\|e\|j\|e\|c\|t\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|i\|p\|i\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|i\|p\|i\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi trình duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|R\|e\|v\|i\|e\|w\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **{approvalType === 'approve' ? : } {approvalType ==** | `\|(\|)\| \|=\|>\| \|{\| \|a\|l\|e\|r\|t\|(\|`\|Đ\|ã\| \|$\|{\|a\|p\|p\|r\|o\|v\|a\|l\|T\|y\|p\|e\| \|=\|=\|=\| \|'\|a\|p\|p\|r\|o\|v\|e\|'\| \|?\| \|'\|p\|h\|ê\| \|d\|u\|y\|ệ\|t\|'\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |

### File: `pages/open-data/OpenDataPublishedListPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|i\|t\|e\|m\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **×** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Tải {fmt}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|o\|w\|n\|l\|o\|a\|d\|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|,\| \|f\|m\|t\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Tải xuống** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/open-data/OpenDataPublishPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|s\|e\|t\|(\|d\|a\|t\|a\|s\|e\|t\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xem API** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Cập nhật** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Copy** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/open-data/OpenDataReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|C\|a\|t\|e\|g\|o\|r\|y\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|S\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất kết quả** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/open-data/OpenDataSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Quản lý danh mục {categories.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt {approvalList.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử thay đổi {historyList.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tất cả {approvalList.length}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ phê duyệt {approvalStats.pending}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã phê duyệt {approvalStats.approved}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối {approvalStats.rejected}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|a\|b\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm danh mục mới** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|(\|r\|e\|c\|o\|r\|d\| \|a\|s\| \|a\|n\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tải xuống** | `\|(\|)\| \|=\|>\| \|a\|l\|e\|r\|t\|(\|`\|T\|ả\|i\| \|x\|u\|ố\|n\|g\| \|p\|h\|i\|ê\|n\| \|b\|ả\|n\| \|$\|{\|r\|e\|c\|o\|r\|d\|.\|v\|e\|r\|s\|i\|o\|n\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Khôi phục** | `\|(\|)\| \|=\|>\| \|a\|l\|e\|r\|t\|(\|`\|K\|h\|ô\|i\| \|p\|h\|ụ\|c\| \|v\|ề\| \|p\|h\|i\|ê\|n\| \|b\|ả\|n\| \|$\|{\|r\|e\|c\|o\|r\|d\|.\|v\|e\|r\|s\|i\|o\|n\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **{category.name} {category.description}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|a\|t\|e\|g\|o\|r\|y\|C\|l\|i\|c\|k\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|u\|b\|m\|i\|t\|F\|o\|r\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Chọn tất cả** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|a\|l\|l\|F\|i\|e\|l\|d\|I\|d\|s\| \|=\| \|m\|o\|c\|k\|T\|a\|b\|l\|e\|F\|i\|e\|l\|d\|s\|[\|f\|o\|r\|m\|D\|a\|t\|a\|.\|s\|e\|l\|e\|c\|t\|e\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|s\|e\|l\|e\|c\|t\|e\|d\|F\|i\|e\|l\|d\|s\|:\| \|[\|]\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa file** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|t\|t\|a\|c\|h\|e\|d\|F\|i\|l\|e\|s\|(\|a\|t\|t\|a\|c\|h\|e\|d\|F\|i\|l\|e\|s\|.\|f\|i\|l\|t\|e\|r\|(\|(\|_\|,\| \|i\|)\| \|=\|>\| \|i\| \|!\|=\|=\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|A\|d\|d\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi phê duyệt** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|E\|d\|i\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|c\|o\|n\|f\|i\|r\|m\|D\|e\|l\|e\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|N\|o\|t\|e\|(\|'\|'\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|N\|o\|t\|e\|(\|'\|'\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Phê duyệt** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|A\|c\|t\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|j\|e\|c\|t\|R\|e\|a\|s\|o\|n\|(\|'\|'\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|j\|e\|c\|t\|R\|e\|a\|s\|o\|n\|(\|'\|'\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Từ chối** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|A\|c\|t\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|(\|'\|'\|)\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi phê duyệt** | `\|c\|o\|n\|f\|i\|r\|m\|A\|p\|p\|r\|o\|v\|a\|l\|A\|c\|t\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/open-data/OpenDataStatisticsPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Làm mới dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/open-data/OpenDataUpdateRulesPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm quy tắc mới** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chạy ngay** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|u\|n\|N\|o\|w\|(\|r\|u\|l\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử chạy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|H\|i\|s\|t\|o\|r\|y\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Chọn tất cả** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|a\|l\|l\|F\|i\|e\|l\|d\|s\| \|=\| \|m\|o\|c\|k\|T\|a\|b\|l\|e\|F\|i\|e\|l\|d\|s\|[\|f\|o\|r\|m\|D\|a\|t\|a\|.\|s\|o\|u\|r\|c\|e\|T\|a\|b\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|.\|.\|.\|f\|o\|r\|m\|D\|a\|t\|a\|,\| \|s\|e\|l\|e\|c\|t\|e\|d\|F\|i\|e\|l\|d\|s\|:\| \|[\|]\|` | ℹ️ Action Nội bộ / Điều hướng |
| **+ Thêm** | `\|h\|a\|n\|d\|l\|e\|A\|d\|d\|E\|m\|a\|i\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|m\|o\|v\|e\|E\|m\|a\|i\|l\|(\|e\|m\|a\|i\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem trước** | `\|h\|a\|n\|d\|l\|e\|P\|r\|e\|v\|i\|e\|w\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|D\|r\|a\|f\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu & Kích hoạt** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|A\|n\|d\|A\|c\|t\|i\|v\|a\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|H\|i\|s\|t\|o\|r\|y\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tự động tạo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải xuống log** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sao chép** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: OPEN-DATA-CATEGORY

### File: `pages/open-data-category/OpenDataCategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|a\|t\|e\|g\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Metadata** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|t\|a\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Giấy phép** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|i\|c\|e\|n\|s\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử phiên bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thiết lập lịch công bố** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|c\|h\|e\|d\|u\|l\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|T\|e\|r\|m\|(\|'\|'\|)\|;\| \|s\|e\|t\|S\|t\|a\|t\|u\|s\|F\|i\|l\|t\|e\|r\|(\|'\|a\|l\|l\|'\|)\|;\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công bố** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Bỏ chọn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|d\|s\|(\|n\|e\|w\| \|S\|e\|t\|(\|)\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|i\|t\|e\|m\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|i\|t\|e\|m\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|U\|n\|p\|u\|b\|l\|i\|s\|h\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|(\|i\|t\|e\|m\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm lịch mới** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|c\|h\|e\|d\|u\|l\|e\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|d\|a\|t\|a\|s\|e\|t\|I\|d\|:\| \|'\|'\|,\| \|f\|r\|e\|q\|u\|e\|n\|c\|y\|:\| \|'\|d\|a\|i\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|c\|h\|e\|d\|u\|l\|e\|(\|s\|c\|h\|e\|d\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|c\|h\|e\|d\|u\|l\|e\|M\|o\|d\|a\|l\|(\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|c\|h\|e\|d\|u\|l\|e\|(\|s\|c\|h\|e\|d\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|S\|c\|h\|e\|d\|u\|l\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|c\|o\|d\|e\| \||\||\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|n\|a\|m\|e\|)\| \|r\|e\|t\|u\|r\|n\|;\| \|c\|o\|n\|s\|t\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|c\|o\|d\|e\|:\| \|'\|'\|,\| \|n\|a\|m\|e\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|c\|o\|d\|e\| \||\||\| \|!\|f\|o\|r\|m\|D\|a\|t\|a\|.\|n\|a\|m\|e\|)\| \|r\|e\|t\|u\|r\|n\|;\| \|c\|o\|n\|s\|t\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận** | `\|c\|o\|n\|f\|i\|r\|m\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận** | `\|c\|o\|n\|f\|i\|r\|m\|U\|n\|p\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|j\|e\|c\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|F\|r\|o\|m\|M\|o\|d\|a\|l\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Bỏ công khai** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|D\|a\|t\|a\|(\|d\|a\|t\|a\|.\|m\|a\|p\|(\|i\|t\|e\|m\| \|=\|>\| \|i\|t\|e\|m\|.\|i\|d\| \|=\|=\|=\| \|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|.\|i\|d\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Công khai** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|.\|a\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|u\|s\| \|!\|=\|=\| \|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\| \|{\| \|a\|l\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu thay đổi** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận công bố** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận hủy công bố** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|U\|n\|p\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận phê duyệt** | `\|h\|a\|n\|d\|l\|e\|B\|u\|l\|k\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **a.id === selectedApprover)?.name || ''; setData(da** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|!\|s\|e\|l\|e\|c\|t\|e\|d\|A\|p\|p\|r\|o\|v\|e\|r\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|V\|u\|i\| \|l\|ò\|n\|g\| \|c\|h\|ọ\|n\| \|n\|g\|ư\|ờ\|i\| \|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **{selectedItem.approvalStatus !== 'approved' ? 'Đón** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|F\|r\|o\|m\|M\|o\|d\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận công khai** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|)\| \|{\| \|s\|e\|t\|D\|a\|t\|a\|(\|d\|a\|t\|a\|.\|m\|a\|p\|(\|i\|t\|e\|m\| \|=\|>\| \|i\|t\|e\|m\|.\|i\|d\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|N\|o\|t\|e\|(\|'\|'\|)\|;\| \|s\|e\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận phê duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|I\|t\|e\|m\|)\| \|{\| \|s\|e\|t\|D\|a\|t\|a\|(\|d\|a\|t\|a\|.\|m\|a\|p\|(\|i\|t\|e\|m\| \|=\|>\| \|i\|t\|e\|m\|.\|i\|d\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|j\|e\|c\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|e\|j\|e\|c\|t\|R\|e\|a\|s\|o\|n\|(\|'\|'\|)\|;\| \|s\|e\|t\|S\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **item.id === selectedItem.id ? { ...item, approvalS** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|!\|r\|e\|j\|e\|c\|t\|R\|e\|a\|s\|o\|n\|.\|t\|r\|i\|m\|(\|)\|)\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|V\|u\|i\| \|l\|ò\|n\|g\| \|n\|h\|ậ\|p\| \|l\|ý\| \|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **{selectedSchedule ? 'Đóng' : 'Hủy'}** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|c\|h\|e\|d\|u\|l\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|c\|h\|e\|d\|u\|l\|e\|(\|n\|u\|l\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **{ const selectedDataset = data.find(d => d.id ===** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|D\|a\|t\|a\|s\|e\|t\|I\|d\|s\|.\|s\|i\|z\|e\| \|=\|=\|=\| \|0\| \||\||\| \|!\|s\|c\|h\|e\|d\|u\|l\|e\|F\|o\|r\|m\|D\|a\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|S\|c\|h\|e\|d\|u\|l\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|c\|h\|e\|d\|u\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa lịch** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|c\|h\|e\|d\|u\|l\|e\|s\|(\|s\|c\|h\|e\|d\|u\|l\|e\|s\|.\|f\|i\|l\|t\|e\|r\|(\|s\| \|=\|>\| \|s\|.\|i\|d\| \|!\|=\|=\| \|s\|e\|l\|e\|c\|t\|e\|d\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Import** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Export** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa Metadata** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem file PDF** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa giấy phép** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/open-data-category/OpenDataCategorySetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công khai danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo và tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng danh mục {categories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang hoạt động {categories.filter(c => c.isActive)** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh mục chuẩn {categories.filter(c => c.dataType** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh mục tham chiếu {categories.filter(c => c.data** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|f\|e\|r\|e\|n\|c\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|T\|y\|p\|e\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|S\|e\|a\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ duyệt {approvalRequests.filter(r => r.status =** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã duyệt {approvalRequests.filter(r => r.status ==** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối {approvalRequests.filter(r => r.status ===** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|a\|l\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|r\|e\|j\|e\|c\|t\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|A\|p\|p\|r\|o\|v\|a\|l\|F\|i\|l\|t\|e\|r\|T\|y\|p\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng đã công khai {publishedCategories.length}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang công khai {publishedCategories.filter(c => c.** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|S\|t\|a\|t\|s\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|c\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa bộ lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|P\|u\|b\|l\|i\|s\|h\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm danh mục mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Cài đặt** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Gỡ công khai** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa bộ lọc** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất Excel** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất PDF** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất CSV** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem thống kê** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: OPEN-DATA-REPORT

### File: `pages/open-data-report/OpenDataReportPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tìm kiếm và lọc** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|a\|r\|c\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo phân loại** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thống kê lượt truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|c\|c\|e\|s\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đặt lại** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|a\|r\|c\|h\|K\|e\|y\|w\|o\|r\|d\|(\|'\|'\|)\|;\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|C\|a\|t\|e\|g\|o\|r\|y\|(\|'\|a\|l\|l\|'\|)\|;\| \|s\|e\|t\|F\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất Excel** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất PDF** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|E\|x\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|P\|D\|F\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tạo báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tạo báo cáo phân loại** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem tất cả** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: OPENDATACATEGORYPAGE.TSX

### File: `pages/OpenDataCategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt danh mục {stats.pending > 0 && ( {stats.** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|a\|p\|p\|r\|o\|v\|a\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công bố dữ liệu mở** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|p\|u\|b\|l\|i\|s\|h\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Báo cáo & Tìm kiếm** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|r\|e\|p\|o\|r\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thu thập số liệu thống kê** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|C\|u\|r\|r\|e\|n\|t\|T\|a\|b\|(\|'\|s\|t\|a\|t\|i\|s\|t\|i\|c\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tạo danh mục mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đề xuất công bố** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|r\|o\|p\|o\|s\|e\|P\|u\|b\|l\|i\|s\|h\|(\|c\|a\|t\|e\|g\|o\|r\|y\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Công bố dữ liệu mở** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|P\|u\|b\|l\|i\|s\|h\|C\|a\|t\|e\|g\|o\|r\|y\|(\|c\|a\|t\|e\|g\|o\|r\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tổng số danh mục {stats.total}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã phê duyệt {stats.approved}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|a\|p\|p\|r\|o\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chờ phê duyệt {stats.pending}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|e\|n\|d\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã công bố {stats.published} {stats.totalDownloads** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|t\|a\|t\|C\|a\|r\|d\|C\|l\|i\|c\|k\|(\|'\|p\|u\|b\|l\|i\|s\|h\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xuất báo cáo** | `\|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|R\|e\|p\|o\|r\|t\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|r\|e\|s\|e\|t\|F\|o\|r\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|V\|i\|e\|w\|i\|n\|g\|C\|a\|t\|e\|g\|o\|r\|y\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|C\|a\|t\|e\|g\|o\|r\|y\|T\|o\|A\|p\|p\|r\|o\|v\|e\|(\|n\|u\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi yêu cầu** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|A\|p\|p\|r\|o\|v\|a\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|C\|a\|t\|e\|g\|o\|r\|y\|T\|o\|P\|u\|b\|l\|i\|s\|h\|(\|n\|u\|l\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Công bố** | `\|h\|a\|n\|d\|l\|e\|C\|o\|n\|f\|i\|r\|m\|P\|u\|b\|l\|i\|s\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Đặt lại** | `\|r\|e\|s\|e\|t\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Đóng Modal |
| **Tìm kiếm** | `\|h\|a\|n\|d\|l\|e\|A\|d\|v\|a\|n\|c\|e\|d\|S\|e\|a\|r\|c\|h\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: ORCHESTRATION

### File: `pages/orchestration/APIFormFields.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Add Header** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|H\|e\|a\|d\|e\|r\|s\|(\|[\|.\|.\|.\|h\|e\|a\|d\|e\|r\|s\|,\| \|{\| \|k\|e\|y\|:\| \|'\|'\|,\| \|v\|a\|l\|u\|e\|:\| \|'\|'\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa header** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|n\|e\|w\|H\|e\|a\|d\|e\|r\|s\| \|=\| \|h\|e\|a\|d\|e\|r\|s\|.\|f\|i\|l\|t\|e\|r\|(\|(\|_\|,\| \|i\|)\| \|=\|>\| \|i\| \|!\|=\|=\| \|i\|n\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Add Query Param** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|Q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|s\|(\|[\|.\|.\|.\|q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|s\|,\| \|{\| \|k\|e\|y\|:\| \|'\|'\|,\| \|v\|a\|l\|u\|e\|:\| \|'\|'\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa query param** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|n\|e\|w\|P\|a\|r\|a\|m\|s\| \|=\| \|q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|s\|.\|f\|i\|l\|t\|e\|r\|(\|(\|_\|,\| \|i\|)\| \|=\|>\| \|i\| \|!\|=\|=\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/orchestration/APIManagementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **API chủ động {activeTab === 'active' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|a\|c\|t\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cung cấp dữ liệu thụ động hoặc theo yêu cầu {activ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|a\|s\|s\|i\|v\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm API mới** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|{\| \|n\|a\|m\|e\|:\| \|'\|'\|,\| \|d\|e\|s\|c\|r\|i\|p\|t\|i\|o\|n\|:\| \|'\|'\|,\| \|b\|a\|s\|e\|U\|r\|l\|:\| \|'\|'\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Giám sát** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|M\|o\|n\|i\|t\|o\|r\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Xuất dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|o\|r\|t\|D\|r\|o\|p\|d\|o\|w\|n\|I\|d\|(\|e\|x\|p\|o\|r\|t\|D\|r\|o\|p\|d\|o\|w\|n\|I\|d\| \|=\|=\|=\| \|a\|p\|i\|.\|i\|d\| \|?\| \|n\|u\|l\|l\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **JSON** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|j\|s\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **CSV** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|c\|s\|v\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **XML** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|x\|m\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Excel** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|x\|p\|o\|r\|t\|S\|i\|n\|g\|l\|e\|A\|P\|I\|(\|a\|p\|i\|,\| \|'\|e\|x\|c\|e\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Công bố** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **0 ? headers : (formData.headerName && formData.api** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|T\|e\|s\|t\|U\|r\|l\|(\|`\|$\|{\|f\|o\|r\|m\|D\|a\|t\|a\|.\|b\|a\|s\|e\|U\|r\|l\| \||\||\| \|'\|'\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|s\|a\|v\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Công bố** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Cập nhật** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|u\|p\|d\|a\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|d\|e\|l\|e\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Công bố** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|)\| \|{\| \|s\|e\|t\|A\|p\|i\|s\|(\|a\|p\|i\|s\|.\|m\|a\|p\|(\|a\|p\|i\| \|=\|>\| \|a\|p\|i\|.\|i\|d\| \|=\|=\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|U\|n\|p\|u\|b\|l\|i\|s\|h\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy công bố** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|s\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|)\| \|{\| \|s\|e\|t\|A\|p\|i\|s\|(\|a\|p\|i\|s\|.\|m\|a\|p\|(\|a\|p\|i\| \|=\|>\| \|a\|p\|i\|.\|i\|d\| \|=\|=\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|M\|o\|n\|i\|t\|o\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|M\|o\|n\|i\|t\|o\|r\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xuất dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/orchestration/DataReconciliationAPIPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm API đối soát mới** | `\|(\|)\| \|=\|>\| \|{\| \|r\|e\|s\|e\|t\|F\|o\|r\|m\|(\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|P\|I\|(\|a\|p\|i\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|s\|a\|v\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Cập nhật** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|u\|p\|d\|a\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|H\|a\|n\|d\|l\|e\| \|d\|e\|l\|e\|t\|e\| \|l\|o\|g\|i\|c\| \|h\|e\|r\|e\| \|s\|e\|t\|A\|p\|i\|s\|(\|a\|p\|i\|s\|.\|f\|i\|l\|t\|e\|r\|(\|a\|p\|i\| \|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Chạy ngay** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/orchestration/ServiceCategoryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm danh mục mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/orchestration/ServiceSetupPageUpdated.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thiết lập dịch vụ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Dữ liệu thụ động/Theo yêu cầu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|a\|s\|s\|i\|v\|e\|-\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấp quyền truy cập API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|e\|r\|m\|i\|s\|s\|i\|o\|n\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Quản lý phiên bản API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|v\|e\|r\|s\|i\|o\|n\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Giám sát & Log** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|o\|n\|i\|t\|o\|r\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm dịch vụ mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|F\|o\|r\|m\|D\|a\|t\|a\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Cấu hình** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Trình duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|t\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Cấp quyền mới** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|G\|r\|a\|n\|t\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\| \|s\|e\|t\|G\|r\|a\|n\|t\|S\|t\|e\|p\|(\|1\|)\|;\| \|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Thay thế** | `\|(\|)\| \|=\|>\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|T\|h\|a\|y\| \|t\|h\|ế\| \|đ\|ơ\|n\| \|v\|ị\|:\| \|'\| \|+\| \|u\|n\|i\|t\|)\|;\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|a\|l\|e\|r\|t\|(\|'\|X\|ó\|a\| \|đ\|ơ\|n\| \|v\|ị\|:\| \|'\| \|+\| \|u\|n\|i\|t\|)\|;\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Thêm đơn vị** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|i\|F\|o\|r\|G\|r\|a\|n\|t\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|G\|r\|a\|n\|t\|P\|e\|r\|m\|i\|s\|s\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Thêm đơn vị** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|A\|p\|i\|F\|o\|r\|G\|r\|a\|n\|t\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|G\|r\|a\|n\|t\|P\|e\|r\|m\|i\|s\|s\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|r\|v\|i\|c\|e\|(\|s\|e\|r\|v\|i\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Thêm phiên bản** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|(\|v\|e\|r\|s\|i\|o\|n\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|D\|e\|t\|a\|i\|l\|M\|o\|d\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|V\|e\|r\|s\|i\|o\|n\|F\|o\|r\|m\|(\|{\| \|a\|p\|i\|C\|o\|d\|e\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|V\|e\|r\|s\|i\|o\|n\|F\|o\|r\|m\|(\|{\| \|a\|p\|i\|C\|o\|d\|e\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **s.code === versionForm.apiCode); const newVersion:** | `\|(\|)\| \|=\|>\| \|{\| \|i\|f\| \|(\|!\|v\|e\|r\|s\|i\|o\|n\|F\|o\|r\|m\|.\|a\|p\|i\|C\|o\|d\|e\| \||\||\| \|!\|v\|e\|r\|s\|i\|o\|n\|F\|o\|r\|m\|.\|v\|e\|r\|s\|i\|o\|n\| \||\||\| \|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|V\|e\|r\|s\|i\|o\|n\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|V\|e\|r\|s\|i\|o\|n\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu thay đổi** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu cấu hình** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa dịch vụ** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi yêu cầu duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|u\|b\|m\|i\|t\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **s.id === selectedService.id ? { ...s, status: 'ina** | `\|(\|)\| \|=\|>\| \|{\| \|/\|/\| \|L\|ấ\|y\| \|g\|i\|á\| \|t\|r\|ị\| \|q\|u\|y\|ế\|t\| \|đ\|ị\|n\|h\| \|t\|ừ\| \|r\|a\|d\|i\|o\| \|b\|u\|t\|t\|o\|n\| \|c\|o\|n\|s\|t\| \|d\|e\|c\|i\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Copy** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Tải xuống** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: PROCESSING

### File: `pages/processing/GenericProcessingPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{isApplied ? 'Hủy áp dụng' : 'Áp dụng'}** | `\|(\|e\|:\| \|a\|n\|y\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|R\|u\|l\|e\|A\|p\|p\|l\|i\|c\|a\|t\|i\|o\|n\|(\|i\|d\|,\| \|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{service.name}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|S\|e\|r\|v\|i\|c\|e\|I\|d\|(\|s\|e\|r\|v\|i\|c\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Làm sạch (4)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|e\|a\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chuẩn hóa (3)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|t\|a\|n\|d\|a\|r\|d\|i\|z\|e\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Biến đổi (3)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|t\|r\|a\|n\|s\|f\|o\|r\|m\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách lỗi (12)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|e\|r\|r\|o\|r\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phân loại dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa toàn bảng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Chỉnh sửa các trường** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Gửi tất cả về hệ thống nguồn** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu cấu hình** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|C\|l\|a\|s\|s\|i\|f\|y\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy bỏ** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xác nhận Gửi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|S\|e\|n\|d\|P\|o\|p\|u\|p\|O\|p\|e\|n\|(\|f\|a\|l\|s\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu cấu hình** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Đóng** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất danh sách lỗi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/processing/ProcessedDataPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tìm kiếm nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Icon Button** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/processing/ProcessingAdminJusticePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingAuctionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingBusinessHouseholdPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingCompensationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingCooperationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingEnforcementPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingEnterprisePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingForensicPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingJudgmentPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingJudicialAssistancePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingLawyerPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingLegalAidPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingLegalEducationPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingNationalityPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingNotaryPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thông tin kết nối API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `pages/processing/ProcessingRuleSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Quản lý quy tắc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|R\|u\|l\|e\|M\|a\|n\|a\|g\|e\|m\|e\|n\|t\|S\|o\|u\|r\|c\|e\|(\|r\|u\|l\|e\|.\|d\|a\|t\|a\|S\|o\|u\|r\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|R\|u\|l\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Phân loại dữ liệu** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|C\|l\|a\|s\|s\|i\|f\|i\|c\|a\|t\|i\|o\|n\|M\|o\|d\|a\|l\|(\|t\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Chạy quy tắc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|R\|u\|n\|n\|i\|n\|g\|R\|u\|l\|e\|(\|r\|u\|l\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|R\|u\|n\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Danh sách lỗi** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|E\|r\|r\|o\|r\|L\|i\|s\|t\|D\|a\|t\|a\|S\|o\|u\|r\|c\|e\|(\|r\|u\|l\|e\|.\|d\|a\|t\|a\|S\|o\|u\|r\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|H\|i\|s\|t\|o\|r\|y\|D\|a\|t\|a\|S\|o\|u\|r\|c\|e\|(\|r\|u\|l\|e\|.\|d\|a\|t\|a\|S\|o\|u\|r\|c\|e\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|H\|i\|s\|t\|o\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Lưu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|R\|u\|n\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|R\|u\|n\|n\|i\|n\|g\|R\|u\|l\|e\|(\|n\|u\|l\|l\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Bắt đầu chạy** | `\|(\|)\| \|=\|>\| \|{\| \|a\|l\|e\|r\|t\|(\|`\|B\|ắ\|t\| \|đ\|ầ\|u\| \|c\|h\|ạ\|y\| \|$\|{\|r\|u\|n\|n\|i\|n\|g\|R\|u\|l\|e\|.\|r\|u\|l\|e\|s\|.\|c\|l\|e\|a\|n\|i\|n\|g\| \|+\| \|r\|.\|.\|.\|` | ❌ Chỉ Cảnh báo Alert (Cần Popup) |
| **Xuất dữ liệu** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/processing/ProcessingSecurityDbPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|p\|r\|o\|c\|e\|s\|s\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu cảnh báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|w\|a\|r\|n\|i\|n\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `processing/APIConnectionForm.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Add Header** | `\|a\|d\|d\|H\|e\|a\|d\|e\|r\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|H\|e\|a\|d\|e\|r\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Add Query Param** | `\|a\|d\|d\|Q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|Q\|u\|e\|r\|y\|P\|a\|r\|a\|m\|(\|i\|n\|d\|e\|x\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Test Kết nối** | `\|h\|a\|n\|d\|l\|e\|T\|e\|s\|t\|C\|o\|n\|n\|e\|c\|t\|i\|o\|n\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu cấu hình** | `\|h\|a\|n\|d\|l\|e\|S\|a\|v\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `processing/ConfigDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem danh sách lỗi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|E\|r\|r\|o\|r\|L\|i\|s\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `processing/DetailedLogs.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tất cả ({statusCounts.all})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thành công ({statusCounts.success})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|s\|u\|c\|c\|e\|s\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lỗi ({statusCounts.error})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|e\|r\|r\|o\|r\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cảnh báo ({statusCounts.warning})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|w\|a\|r\|n\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thông tin ({statusCounts.info})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|i\|n\|f\|o\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|L\|o\|g\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|L\|o\|g\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất log** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `processing/ErrorListModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi hệ thống nguồn** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|S\|o\|u\|r\|c\|e\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi tất cả về hệ thống nguồn** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|S\|o\|u\|r\|c\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|n\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận gửi về hệ thống nguồn** | `\|c\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|T\|o\|S\|o\|u\|r\|c\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|A\|l\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận gửi tất cả** | `\|c\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất danh sách lỗi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `processing/ErrorRecordsList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi hệ thống nguồn** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|T\|o\|S\|o\|u\|r\|c\|e\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi tất cả về hệ thống nguồn** | `\|h\|a\|n\|d\|l\|e\|S\|e\|n\|d\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|T\|o\|S\|o\|u\|r\|c\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|;\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|n\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận gửi về hệ thống nguồn** | `\|c\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|T\|o\|S\|o\|u\|r\|c\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|S\|e\|n\|d\|A\|l\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận gửi tất cả** | `\|c\|o\|n\|f\|i\|r\|m\|S\|e\|n\|d\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất danh sách lỗi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `processing/ExecutorManagementModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm người thực hiện** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|A\|d\|d\|i\|n\|g\|(\|t\|r\|u\|e\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{isAdding ? 'Thêm' : 'Cập nhật'}** | `\|i\|s\|A\|d\|d\|i\|n\|g\| \|?\| \|h\|a\|n\|d\|l\|e\|A\|d\|d\| \|:\| \|h\|a\|n\|d\|l\|e\|U\|p\|d\|a\|t\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|h\|a\|n\|d\|l\|e\|C\|a\|n\|c\|e\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|e\|x\|e\|c\|u\|t\|o\|r\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|e\|x\|e\|c\|u\|t\|o\|r\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `processing/FeedbackManagement.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Tất cả ({statusCounts.all})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|a\|l\|l\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã gửi ({statusCounts.sent})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|s\|e\|n\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đang chờ ({statusCounts.waiting})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|w\|a\|i\|t\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đã xử lý ({statusCounts.resolved})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|F\|i\|l\|t\|e\|r\|S\|t\|a\|t\|u\|s\|(\|'\|r\|e\|s\|o\|l\|v\|e\|d\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|F\|e\|e\|d\|b\|a\|c\|k\|(\|f\|e\|e\|d\|b\|a\|c\|k\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|F\|e\|e\|d\|b\|a\|c\|k\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|F\|e\|e\|d\|b\|a\|c\|k\|(\|n\|u\|l\|l\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Làm mới** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhắc nhở** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `processing/LGSPConnectionList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm kết nối** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|n\|e\|c\|t\|i\|o\|n\|(\|n\|u\|l\|l\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Test kết nối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|T\|e\|s\|t\|(\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{connection.isActive ? 'Bật' : 'Tắt'}** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|T\|o\|g\|g\|l\|e\|A\|c\|t\|i\|v\|e\|(\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|E\|d\|i\|t\|(\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xóa** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|D\|e\|l\|e\|t\|e\|(\|c\|o\|n\|n\|e\|c\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `processing/RuleManagementModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{tab.label} ({tab.count})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|t\|a\|b\|.\|k\|e\|y\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút điều khiển tự do (Icon)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|E\|x\|p\|a\|n\|d\|e\|d\|R\|u\|l\|e\|I\|d\|(\|e\|x\|p\|a\|n\|d\|e\|d\|R\|u\|l\|e\|I\|d\| \|=\|=\|=\| \|r\|u\|l\|e\|.\|i\|d\| \|?\| \|n\|u\|l\|l\| \|:\| \|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **{rule.isApplied ? 'Hủy áp dụng' : 'Áp dụng'}** | `\|(\|)\| \|=\|>\| \|t\|o\|g\|g\|l\|e\|R\|u\|l\|e\|A\|p\|p\|l\|i\|c\|a\|t\|i\|o\|n\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chọn tất cả** | `\|(\|)\| \|=\|>\| \|a\|d\|d\|A\|l\|l\|F\|i\|e\|l\|d\|s\|T\|o\|R\|u\|l\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ chọn tất cả** | `\|(\|)\| \|=\|>\| \|r\|e\|m\|o\|v\|e\|A\|l\|l\|F\|i\|e\|l\|d\|s\|F\|r\|o\|m\|R\|u\|l\|e\|(\|r\|u\|l\|e\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lưu cấu hình** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |

### File: `processing/WarningDataList.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Sửa tất cả ({pendingCount})** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|x\|A\|l\|l\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Kiểm tra** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|C\|h\|e\|c\|k\|M\|a\|s\|t\|e\|r\|D\|a\|t\|a\|(\|r\|e\|c\|o\|r\|d\|.\|r\|e\|c\|o\|r\|d\|I\|d\|,\| \|r\|e\|c\|o\|r\|d\|.\|f\|i\|e\|l\|d\|,\| \|r\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Sửa thủ công** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Áp dụng đề xuất** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|u\|t\|o\|F\|i\|x\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Bỏ qua** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|I\|g\|n\|o\|r\|e\|(\|r\|e\|c\|o\|r\|d\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|x\|A\|l\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xác nhận sửa tất cả** | `\|h\|a\|n\|d\|l\|e\|F\|i\|x\|A\|l\|l\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất danh sách lỗi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu tất cả thay đổi** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: PROVISION

### File: `pages/provision/DataProvisionCatalogAPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/provision/DataProvisionCatalogBPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/provision/DataProvisionCatalogCPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Tìm kiếm nâng cao** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xem chi tiết** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/provision/DataProvisionDldcAPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử cung cấp** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|V\|i\|e\|w\|D\|e\|t\|a\|i\|l\|(\|r\|e\|c\|o\|r\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|c\|l\|o\|s\|e\|M\|o\|d\|a\|l\|` | ✅ Gọi Mở/Đóng Modal |
| **Nhập** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/provision/DataProvisionInternalPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm gói tin mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|E\|d\|i\|t\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Cấu hình trường** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/provision/DataProvisionSharedPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm cấu hình quyền truy cập** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|(\|p\|e\|r\|m\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Duyệt** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|(\|p\|e\|r\|m\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|t\|r\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Thu hồi quyền** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|v\|o\|k\|e\|(\|p\|e\|r\|m\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|V\|i\|e\|w\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|p\|p\|r\|o\|v\|a\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Từ chối** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|R\|e\|j\|e\|c\|t\|(\|s\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phê duyệt** | `\|(\|)\| \|=\|>\| \|h\|a\|n\|d\|l\|e\|A\|p\|p\|r\|o\|v\|e\|(\|s\|e\|l\|e\|c\|t\|e\|d\|P\|e\|r\|m\|i\|s\|s\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/provision/InternalCatalogProvisionPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Dữ liệu danh mục** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|a\|t\|a\|l\|o\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Metadata** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|e\|t\|a\|d\|a\|t\|a\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|d\|a\|t\|a\|-\|l\|i\|s\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử xử lý** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm gói tin mới** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|d\|d\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Xem cấu trúc** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|P\|a\|c\|k\|a\|g\|e\|(\|p\|k\|g\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|s\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Hiển thị Modal/Popup |
| **Nút Đóng (Icon X)** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|i\|e\|l\|d\|s\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: QUALITYCONTROLPAGE.TSX

### File: `pages/QualityControlPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Kiểm tra dữ liệu** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|v\|a\|l\|i\|d\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thông báo** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|n\|o\|t\|i\|f\|i\|c\|a\|t\|i\|o\|n\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Phản hồi** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|T\|a\|b\|(\|'\|t\|r\|a\|c\|k\|i\|n\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |

---

# MODULE: RECONCILIATION

### File: `pages/reconciliation/ErrorDetailsModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Nút Đóng (Icon X)** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Gửi lại danh sách** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/reconciliation/ReconciliationDetailModal.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Đóng** | `\|o\|n\|C\|l\|o\|s\|e\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem lịch sử đối soát** | `\|o\|n\|V\|i\|e\|w\|H\|i\|s\|t\|o\|r\|y\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/reconciliation/ReconciliationHistoryTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/reconciliation/ReconciliationLogTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Xuất log** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

### File: `pages/reconciliation/ReconciliationServiceSetupTab.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Thêm cấu hình API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|I\|s\|A\|d\|d\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Chỉnh sửa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|;\| \|s\|e\|t\|I\|s\|E\|d\|i\|t\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|)\|;\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|C\|o\|n\|f\|i\|g\|(\|c\|o\|n\|f\|i\|g\|)\|;\| \|s\|e\|t\|I\|s\|D\|e\|l\|e\|t\|e\|M\|o\|d\|a\|l\|O\|p\|e\|n\|(\|t\|r\|u\|e\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |

---

# MODULE: RECONCILIATIONSETUPPAGE.TSX

### File: `pages/ReconciliationSetupPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Quản lý {activeTab === 'management' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|m\|a\|n\|a\|g\|e\|m\|e\|n\|t\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thiết lập {activeTab === 'setup' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|s\|e\|t\|u\|p\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Log {activeTab === 'logs' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|l\|o\|g\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Lịch sử {activeTab === 'history' && ( )}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|h\|i\|s\|t\|o\|r\|y\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Xem chi tiết** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|R\|e\|c\|o\|r\|d\|(\|r\|e\|c\|o\|r\|d\|)\|;\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|c\|o\|r\|d\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|.\|.\|.\|` | ✅ Hiển thị Modal/Popup |
| **Thêm cấu hình API** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|A\|P\|I\|C\|o\|n\|f\|i\|g\|M\|o\|d\|a\|l\|(\|t\|r\|u\|e\|)\|` | ✅ Hiển thị Modal/Popup |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|F\|e\|e\|d\|b\|a\|c\|k\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng chi tiết gói tin** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|a\|c\|k\|a\|g\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|P\|a\|c\|k\|a\|g\|e\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Hủy** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|D\|e\|l\|e\|t\|e\|P\|a\|c\|k\|a\|g\|e\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Xóa** | `\|(\|)\| \|=\|>\| \|{\| \|s\|e\|t\|P\|a\|c\|k\|a\|g\|e\|s\|(\|p\|a\|c\|k\|a\|g\|e\|s\|.\|f\|i\|l\|t\|e\|r\|(\|p\| \|=\|>\| \|p\|.\|i\|d\| \|!\|=\|=\| \|p\|a\|c\|k\|a\|g\|e\|T\|o\|D\|.\|.\|.\|` | ✅ Gọi Mở/Đóng Modal |
| **Đóng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|h\|o\|w\|R\|e\|c\|o\|r\|d\|D\|e\|t\|a\|i\|l\|M\|o\|d\|a\|l\|(\|f\|a\|l\|s\|e\|)\|` | ✅ Gọi Mở/Đóng Modal |
| **Kiểm tra kết nối** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xóa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất log** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Xuất báo cáo** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: SYSTEMADMINPAGE.TSX

### File: `pages/SystemAdminPage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **Người dùng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|u\|s\|e\|r\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Vai trò** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|r\|o\|l\|e\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Nhóm người dùng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|g\|r\|o\|u\|p\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Danh sách chức năng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|f\|u\|n\|c\|t\|i\|o\|n\|s\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình chức năng** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|f\|u\|n\|c\|t\|i\|o\|n\|-\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Cấu hình** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|A\|c\|t\|i\|v\|e\|T\|a\|b\|(\|'\|c\|o\|n\|f\|i\|g\|'\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **Thêm người dùng** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Chỉnh sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Thêm vai trò** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Sửa** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Thêm nhóm** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |
| **Lưu cấu hình** | `\|K\|h\|u\|y\|ế\|t\| \|t\|h\|u\|ộ\|c\| \|t\|í\|n\|h\| \|o\|n\|C\|l\|i\|c\|k\|` | ❌ KHÔNG CÓ ACTION |

---

# MODULE: USERGUIDEPAGE.TSX

### File: `pages/UserGuidePage.tsx`
| Tên nút / Chức năng | Hành động (Action Config) | Thuộc tính Popup/Modal |
|---|---|---|
| **{section.title}** | `\|(\|)\| \|=\|>\| \|s\|e\|t\|S\|e\|l\|e\|c\|t\|e\|d\|S\|e\|c\|t\|i\|o\|n\|(\|s\|e\|c\|t\|i\|o\|n\|.\|i\|d\|)\|` | ℹ️ Action Nội bộ / Điều hướng |
| **s.id === selectedSection) === 0} className="flex i** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|c\|u\|r\|r\|e\|n\|t\|I\|n\|d\|e\|x\| \|=\| \|s\|e\|c\|t\|i\|o\|n\|s\|.\|f\|i\|n\|d\|I\|n\|d\|e\|x\|(\|s\| \|=\|>\| \|s\|.\|i\|d\| \|=\|=\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |
| **s.id === selectedSection) === sections.length - 1}** | `\|(\|)\| \|=\|>\| \|{\| \|c\|o\|n\|s\|t\| \|c\|u\|r\|r\|e\|n\|t\|I\|n\|d\|e\|x\| \|=\| \|s\|e\|c\|t\|i\|o\|n\|s\|.\|f\|i\|n\|d\|I\|n\|d\|e\|x\|(\|s\| \|=\|>\| \|s\|.\|i\|d\| \|=\|=\|.\|.\|.\|` | ℹ️ Action Nội bộ / Điều hướng |

