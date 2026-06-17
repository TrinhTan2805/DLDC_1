# QUY TẮC LÀM VIỆC VỚI CODEBASE DLDC_1

## QUAN TRỌNG — ĐỌC TRƯỚC KHI THỰC HIỆN BẤT KỲ THAY ĐỔI NÀO

Trước khi chỉnh sửa bất kỳ file nào trong project này, AI **bắt buộc** phải đọc và tuân thủ file sau:

```
F:\BTP\DLDC_1\tailieu\docs\stauts.md
```

File này là **Bảng Theo Dõi Trạng Thái Mã Nguồn (Status Tracker)** — quy định tính năng nào được phép sửa và tính năng nào đang bị khóa.

---

## QUY TẮC CỐT LÕI (trích từ stauts.md)

### 1. Chỉ sửa tính năng có dấu `[x]`
- `[x]` = WIP (đang được yêu cầu sửa hôm nay) → **AI được phép chỉnh sửa**
- `[ ]` = LOCKED 🔒 → **AI tuyệt đối không được đọc, phân tích hay sửa đổi**

### 2. Dừng ngay khi ảnh hưởng đến file bị khóa
Nếu trong quá trình sửa tính năng `[x]` mà phát hiện cần chỉnh sửa file chung hoặc ảnh hưởng đến tính năng `[ ]` khác → **DỪNG NGAY**, thông báo cho PM về:
- (a) File/thành phần bị ảnh hưởng
- (b) Tính năng bị khóa liên quan
- (c) Phương án xử lý đề xuất

### 3. Báo cáo mọi thay đổi
Ghi chép tất cả thay đổi vào `docs/log/log_update.md`

---

## CẤU TRÚC PHÂN HỆ (tóm tắt)

| # | Phân hệ | Thư mục chính |
|---|---------|--------------|
| 1 | Đăng nhập & Core | `pages/LoginPage.tsx`, `admin/menuStructure.ts` |
| 2 | Thu thập dữ liệu | `pages/collection/` |
| 3 | Xử lý & Chuẩn hóa | `pages/processing/` |
| 4 | Đối soát dữ liệu | `pages/reconciliation/` |
| 5 | Danh mục BTP | `pages/category/` |
| 6 | Dữ liệu ngoại | `pages/external/` |
| 7 | Dữ liệu nội bộ | `pages/internal/` |
| 8 | Master Data | `pages/master-data/`, `pages/master-data-list/` |
| 9 | Cung cấp dữ liệu | `pages/provisioning/`, `pages/provision/`, `pages/orchestration/` |
| 10 | Dữ liệu mở | `pages/open-data/`, `pages/open-data-category/` |
| 11 | Quản trị hệ thống | `pages/admin/` |

> **Chi tiết đầy đủ đến từng file** xem tại: `F:\BTP\DLDC_1\tailieu\docs\stauts.md`

---

## TECH STACK
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Port dev:** `npm run dev`

---

## THIẾT KẾ GIAO DIỆN — BẮT BUỘC ĐỌC KHI TẠO COMPONENT / MODAL MỚI

Mỗi khi AI được yêu cầu **tạo mới hoặc chỉnh sửa** bất kỳ:
- Modal (popup, dialog, drawer)
- Component (bảng, form, tab, card, button, badge...)
- Trang mới (Page)

AI **bắt buộc** phải đọc và áp dụng đúng hệ thống thiết kế trong file:

```
F:\BTP\DLDC_1\tailieu\docs\compomennt.md
```

### Tóm tắt các quy tắc thiết kế bắt buộc (từ compomennt.md)

| Thành phần | Quy tắc cốt lõi |
|---|---|
| **Font chữ** | Inter, system-ui, sans-serif |
| **Cỡ chữ** | Nội dung: 13px · Label form: 13px · Menu: 12px · H1: 16px · H2: 14px |
| **Màu chính** | Primary: `#2563eb` · Destructive: `#dc2626` · Border: `#e2e8f0` |
| **Bo góc** | Nút/Input: `rounded-lg` (8px) · Card: `rounded-xl` (12px) · Modal: `rounded-2xl` |
| **Button Primary** | `bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-[13px]` |
| **Button Secondary** | `bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-[6px]` |
| **Button Destructive** | `bg-red-600 text-white hover:bg-red-700 rounded-lg` |
| **Input** | `border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-blue-500` |
| **Modal header** | `px-6 py-4 border-b border-slate-200 flex items-center justify-between` |
| **Modal footer** | `px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3` |
| **Badge/Tag** | Màu xanh: `bg-blue-50 text-blue-700` · Xanh lá: `bg-green-50 text-green-700` · Đỏ: `bg-red-50 text-red-700` |
| **Table header** | `bg-slate-50 text-[13px] font-semibold text-slate-500 uppercase tracking-tight` |
| **Spacing** | Padding section: `px-6 py-4` · Gap giữa các phần tử: `gap-3` hoặc `gap-4` |
| **Shadow** | Card: `shadow-sm` · Modal: `shadow-2xl` |
| **Transition** | `transition-colors` hoặc `transition-all` · Active: `active:scale-95` |

> **Chi tiết đầy đủ với ví dụ trực quan** xem tại: `F:\BTP\DLDC_1\tailieu\docs\compomennt.md`

### Nguyên tắc nhất quán
- Không tự ý dùng màu, cỡ chữ, spacing khác với design system ở trên
- Khi cần component chưa có trong design system → hỏi PM trước khi tự thiết kế
- Ưu tiên tái sử dụng class Tailwind đã dùng trong codebase hiện có thay vì đặt style mới
