# Tài liệu Thống nhất Component Chung - Hệ thống DLDC

Tài liệu này quy định các tiêu chuẩn về giao diện (UI/UX) cho toàn bộ hệ thống DLDC, bao gồm font chữ, màu sắc, icon và các thành phần giao diện dùng chung nhằm đảm bảo tính nhất quán và trải nghiệm người dùng cao cấp.

---

## 1. Hệ thống Typography (Font & Chữ)

Hệ thống sử dụng bộ font **Inter** hiện đại, tối ưu cho màn hình kỹ thuật số.

| Thành phần | Cỡ chữ (Size) | Trọng số (Weight) | Màu sắc mặc định | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Tiêu đề chính (H1)** | 24px  | Medium (500) | `foreground` | Dùng cho tiêu đề trang |
| **Tiêu đề phụ (H2)** | 20px | Medium (500) | `foreground` | Dùng cho tiêu đề khối/section |
| **Tiêu đề nhỏ (H3)** | 18px | Medium (500) | `foreground` | Dùng cho tiêu đề nhóm |
| **Văn bản nội dung (P)** | 16px | Regular (400) | `foreground` | Cỡ chữ mặc định |
| **Nhãn (Label)** | 14px | Medium (500) | `foreground` | Dùng cho form |
| **Chú thích (Small)** | 12px | Regular (400) | `muted-foreground` | Dùng cho mô tả nhỏ |
| **Liên kết (Link)** | 16px | Medium (500) | `primary` (#2563eb) | Văn bản chứa liên kết (Hyperlink) |

**Font Family:** `Inter, system-ui, sans-serif`

---

## 2. Hệ thống Màu sắc (Color System)

Sử dụng hệ màu Semantic dựa trên Tailwind CSS & OKLCH.

| Tên màu | Mục đích sử dụng | Màu thực tế | Mã màu gợi ý (Hex) |
| :--- | :--- | :---: | :--- |
| **Primary** | Màu chủ đạo (Nút chính, Action quan trọng) | <img src="https://placehold.co/24x24/2563eb/2563eb.png" alt="Primary" style="border-radius:4px" /> | `#2563eb` (Blue 600) |
| **Secondary** | Màu phụ (Nút phụ, Nền nhẹ) | <img src="https://placehold.co/24x24/f1f5f9/f1f5f9.png" alt="Secondary" style="border-radius:4px; border: 1px solid #e2e8f0" /> | `#f1f5f9` (Slate 100) |
| **Destructive** | Màu cảnh báo/Xóa (Nút xóa, Lỗi) | <img src="https://placehold.co/24x24/dc2626/dc2626.png" alt="Destructive" style="border-radius:4px" /> | `#dc2626` (Red 600) |
| **Success** | Màu thành công (Thông báo thành công) | <img src="https://placehold.co/24x24/16a34a/16a34a.png" alt="Success" style="border-radius:4px" /> | `#16a34a` (Green 600) |
| **Warning** | Màu cảnh báo (Lưu ý) | <img src="https://placehold.co/24x24/ca8a04/ca8a04.png" alt="Warning" style="border-radius:4px" /> | `#ca8a04` (Yellow 600) |
| **Foreground** | Màu chữ chính | <img src="https://placehold.co/24x24/020817/020817.png" alt="Foreground" style="border-radius:4px" /> | `#020817` (Slate 950) |
| **Muted** | Màu chữ phụ/Mờ | <img src="https://placehold.co/24x24/64748b/64748b.png" alt="Muted" style="border-radius:4px" /> | `#64748b` (Slate 500) |

---

## 3. Hệ thống Icon Chung (Lucide Icons)

Sử dụng thư viện **Lucide React** cho toàn bộ icon.

| Hành động | Biểu tượng | Tên Icon (Lucide) | Màu sắc gợi ý | Ghi chú |
| :--- | :---: | :--- | :--- | :--- |
| **Dữ liệu / Lớp** | <img src="https://api.iconify.design/lucide:layers.svg?color=%232563eb" width="20"/> | `Layers` | `Blue` | Quản lý nguồn dữ liệu / Lớp bản đồ |
| **Làm mới / Test** | <img src="https://api.iconify.design/lucide:refresh-cw.svg?color=%2364748b" width="20"/> | `RefreshCw` | `Slate` | Đồng bộ dữ liệu hoặc Test kết nối |
| **Thêm nhanh** | <img src="https://api.iconify.design/lucide:plus.svg?color=%232563eb" width="20"/> | `Plus` | `Primary` | Thêm bản ghi hoặc thành phần mới |
| **Kích hoạt / Cấp quyền** | <img src="https://api.iconify.design/lucide:power.svg?color=%23f97316" width="20"/> | `Power` | `Orange` | Bật/Tắt trạng thái hoặc Cấu hình |
| **Xóa sạch / Reset** | <img src="https://api.iconify.design/lucide:eraser.svg?color=%2364748b" width="20"/> | `Eraser` | `Slate` | Xóa trắng dữ liệu nhập hoặc Reset |
| **Xem chi tiết** | <img src="https://api.iconify.design/lucide:eye.svg?color=%2364748b" width="20"/> | `Eye` | `Slate` | Xem thông tin chi tiết (Read-only) |
| **Xóa bỏ** | <img src="https://api.iconify.design/lucide:trash-2.svg?color=%23dc2626" width="20"/> | `Trash2` | `Red` | Xóa vĩnh viễn bản ghi |

### Các hành động bổ sung (Cần thiết cho dự án)

Qua kiểm tra dự án, các hành động sau cũng xuất hiện thường xuyên và cần thống nhất:

| Hành động | Biểu tượng | Tên Icon (Lucide) | Màu sắc gợi ý | Ghi chú |
| :--- | :---: | :--- | :--- | :--- |
| **Chỉnh sửa** | <img src="https://api.iconify.design/lucide:edit-2.svg?color=%234f46e5" width="20"/> | `Edit2` / `Pencil` | `Indigo` | Thay đổi nội dung đã có |
| **Trình duyệt** | <img src="https://api.iconify.design/lucide:send.svg?color=%234f46e5" width="20"/> | `Send` | `Indigo` | Mở giao diện trình duyệt dữ liệu |
| **Duyệt** | <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2316a34a" width="20"/> | `CheckCircle` | `Success` | Phê duyệt hồ sơ / dữ liệu |
| **Từ chối duyệt** | <img src="https://api.iconify.design/lucide:ban.svg?color=%23dc2626" width="20"/> | `Ban` | `Destructive` | Từ chối phê duyệt hồ sơ |
| **Xuất Excel** | <img src="https://api.iconify.design/lucide:file-spreadsheet.svg?color=%2316a34a" width="20"/> | `FileSpreadsheet` | `Success` | Trích xuất dữ liệu ra định dạng .xlsx |
| **Xuất PDF** | <img src="https://api.iconify.design/lucide:file-text.svg?color=%23dc2626" width="20"/> | `FileText` | `Destructive` | Trích xuất dữ liệu ra định dạng .pdf |
| **Tìm kiếm / Lọc** | <img src="https://api.iconify.design/lucide:search.svg?color=%2364748b" width="20"/> | `Search` | `Slate` | Tìm kiếm cơ bản |
| **Tìm kiếm nâng cao** | <img src="https://api.iconify.design/lucide:filter.svg?color=%2364748b" width="20"/> | `Filter` | `Slate` | Lọc dữ liệu theo nhiều tiêu chí |
| **Tải về** | <img src="https://api.iconify.design/lucide:download.svg?color=%232563eb" width="20"/> | `Download` | `Primary` | Tải tài liệu đính kèm |
| **Lưu lại** | <img src="https://api.iconify.design/lucide:save.svg?color=%232563eb" width="20"/> | `Save` | `Primary` | Lưu các thay đổi trong form |


---

## 4. Các Component Chung (Common Components)

Dưới đây là danh sách các component đã được xây dựng và cần tuân thủ thống nhất:

### 4.1. Nút bấm (Button)
- **Primary:** Nền xanh, chữ trắng. Dùng cho hành động xác nhận chính.
- **Outline:** Viền mỏng, không nền. Dùng cho hành động phụ.
- **Ghost:** Không viền, không nền. Dùng cho các hành động trong menu hoặc bảng.
- **Destructive:** Nền đỏ, chữ trắng. Chỉ dùng cho hành động xóa.

**Ví dụ hiển thị:**
<div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
  <button style="background: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Lưu lại (Primary)</button>
  <button style="background: white; color: #020817; padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-weight: 500; cursor: pointer;">Hủy bỏ (Outline)</button>
  <button style="background: transparent; color: #020817; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Bỏ qua (Ghost)</button>
  <button style="background: #dc2626; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Xóa (Destructive)</button>
</div>

### 4.2. Ô nhập liệu (Input & Textarea)
- Chiều cao mặc định: 40px.
- Bo góc: 8px (radius-md).
- Border: 1px solid `border`.
- Trạng thái Focus: Hiển thị ring màu `primary`.

**Ví dụ hiển thị:**
<div style="margin-top: 8px;">
  <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #020817;">Họ và tên</label>
  <input type="text" placeholder="Nhập họ và tên..." style="width: 100%; max-width: 350px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none;" />
</div>

### 4.3. Bảng dữ liệu (Table)
- Header: Nền xám nhạt (`muted`), chữ in đậm.
- Row: Hiển thị hover effect khi di chuột qua.
- Cell: Padding 12px 16px.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; max-width: 500px;">
  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
    <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <tr><th style="padding: 12px 16px; color: #64748b;">Mã</th><th style="padding: 12px 16px; color: #64748b;">Tên</th><th style="padding: 12px 16px; color: #64748b;">Trạng thái</th></tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 16px;">DL_001</td><td style="padding: 12px 16px;">Dữ liệu Dân cư</td><td style="padding: 12px 16px;"><span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Đang chạy</span></td></tr>
    </tbody>
  </table>
</div>

### 4.4. Hộp thoại (Dialog / Modal)
- Backdrop: Làm mờ nền 50%.
- Tiêu đề: Luôn nằm ở phía trên bên trái.
- Nút đóng: Icon `X` ở góc trên bên phải.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 400px; background: white; overflow: hidden;">
  <div style="padding: 16px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #020817;">Cấu hình dữ liệu</h3>
    <span style="color: #64748b; cursor: pointer;">✕</span>
  </div>
  <div style="padding: 16px; font-size: 14px; color: #475569;">
    Bạn có chắc chắn muốn cập nhật các thay đổi này không? Hành động này không thể hoàn tác.
  </div>
  <div style="padding: 12px 16px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 8px;">
    <button style="background: white; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Hủy</button>
    <button style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Xác nhận</button>
  </div>
</div>

### 4.5. Thông báo (Toast / Sonner)
- Vị trí: Góc dưới bên phải hoặc trên cùng giữa.
- Màu sắc: Tương ứng với trạng thái (Success, Error, Warning).

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: fit-content;">
  <span style="color: #16a34a; font-size: 18px;">✅</span>
  <div>
    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #020817;">Thành công!</p>
    <p style="margin: 0; font-size: 12px; color: #64748b;">Dữ liệu đã được lưu vào hệ thống.</p>
  </div>
</div>

### 4.6. Thẻ thông tin (Card)
- Dùng để gom nhóm thông tin, form hoặc hiển thị các chỉ số thống kê (Dashboard).
- Giao diện mặc định: Nền trắng, bo góc 8px, viền mỏng (`border-slate-200`), có bóng đổ nhẹ (`shadow-sm`).

**Ví dụ hiển thị:**
<div style="margin-top: 8px; padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); max-width: 300px;">
  <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 500; color: #64748b;">Tổng số Dữ liệu</h3>
  <p style="margin: 0; font-size: 24px; font-weight: 600; color: #020817;">1,245</p>
  <p style="margin: 4px 0 0 0; font-size: 12px; color: #16a34a;">+12% so với tháng trước</p>
</div>

### 4.7. Chọn giá trị (Select / Dropdown)
- Dùng cho các bộ lọc tìm kiếm hoặc form nhập liệu có danh sách cố định.
- Hiển thị icon chevron ở góc phải để nhận diện dễ dàng.

**Ví dụ hiển thị:**
<div style="margin-top: 8px;">
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 250px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: white; color: #020817; cursor: pointer;">
    <span>Chọn phòng ban...</span>
    <span style="color: #64748b; font-size: 10px;">▼</span>
  </div>
</div>

### 4.8. Nhãn trạng thái (Badge)
- Dùng để hiển thị trạng thái riêng lẻ hoặc phân loại mức độ (Cao, Trung bình, Thấp).
- Kiểu dáng: Nền nhạt, chữ đậm màu tương ứng, bo góc lớn (`rounded-full`).

**Ví dụ hiển thị:**
<div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
  <span style="background: #eff6ff; color: #2563eb; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Ưu tiên thấp</span>
  <span style="background: #fef08a; color: #ca8a04; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Ưu tiên TB</span>
  <span style="background: #fee2e2; color: #dc2626; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Ưu tiên cao</span>
</div>

### 4.9. Thẻ chuyển hướng (Tabs)
- Dùng để tổ chức và chuyển đổi nội dung trên cùng một màn hình (VD: Tab Nội bộ / Bên ngoài).

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: inline-flex; background: #f1f5f9; padding: 4px; border-radius: 8px;">
  <div style="padding: 6px 16px; background: white; border-radius: 6px; font-size: 14px; font-weight: 500; color: #020817; box-shadow: 0 1px 2px rgba(0,0,0,0.05); cursor: pointer;">Dữ liệu Nội bộ</div>
  <div style="padding: 6px 16px; font-size: 14px; font-weight: 500; color: #64748b; cursor: pointer;">Bộ ngành ngoài</div>
</div>

### 4.10. Lọc theo khoảng thời gian (Date Range Picker)
- Dùng để chọn **Ngày bắt đầu** và **Ngày kết thúc** trong cùng một ô nhập liệu duy nhất.
- Định dạng hiển thị: `DD/MM/YYYY - DD/MM/YYYY`.
- Có icon lịch (`Calendar`) để kích hoạt bảng chọn ngày đôi.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: flex; gap: 8px; align-items: center;">
  <div style="position: relative; width: 100%; max-width: 280px;">
    <input type="text" value="01/05/2024 - 12/05/2024" style="width: 100%; padding: 8px 36px 8px 12px; border: 1px solid #2563eb; border-radius: 6px; font-size: 14px; outline: none; background: white;" />
    <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #64748b;">📅</span>
  </div>
</div>

### 4.11. Tìm kiếm thông minh (Combobox)
- Dùng cho các danh sách lớn, cho phép người dùng vừa nhập vừa tìm kiếm.
- Quy định: Chỉ hiển thị tối đa **5 kết quả khớp nhất** để đảm bảo gọn gàng.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; width: 100%; max-width: 250px;">
  <input type="text" value="Hà N" style="width: 100%; padding: 8px 12px; border: 1px solid #2563eb; border-radius: 6px 6px 0 0; font-size: 14px; outline: none;" />
  <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 6px 6px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="padding: 8px 12px; font-size: 14px; background: #eff6ff; color: #2563eb; cursor: pointer;">Hà <b>N</b>ội</div>
    <div style="padding: 8px 12px; font-size: 14px; color: #020817; cursor: pointer;">Hà <b>N</b>am</div>
    <div style="padding: 8px 12px; font-size: 14px; color: #020817; cursor: pointer;">Hà <b>N</b>ĩnh</div>
    <div style="padding: 8px 12px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center;">Hiển thị 3 / 3 kết quả</div>
  </div>
</div>

---

## 5. Quy định chung về giao diện Trình duyệt & Duyệt

- **Giao diện Trình duyệt:** Các bảng danh sách phải có bộ lọc (Filter) và ô tìm kiếm (Search) ở phía trên.
- **Quy trình Duyệt:**
    - Trạng thái Chờ duyệt: Màu vàng.
    - Đã duyệt: Màu xanh lá.
    - Từ chối: Màu đỏ.
    
    **Ví dụ hiển thị:**
    <div style="display: flex; gap: 8px; margin-top: 8px; margin-bottom: 8px;">
      <span style="background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Đã duyệt</span>
      <span style="background: #fef08a; color: #ca8a04; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Chờ duyệt</span>
      <span style="background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Từ chối</span>
    </div>
- **Thanh điều hướng (Sidebar):** Luôn cố định bên trái, chứa menu chức năng chính.
