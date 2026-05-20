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
| **Văn bản nội dung (P)** | 13px | Regular (400) | `foreground` | Cỡ chữ mặc định |
| **Menu** | 12px | Medium (500) | `foreground` | Dùng cho sidebar/menu |
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

## 4. Hệ thống Nền tảng (Foundations)

### 4.1. Hệ thống Khoảng cách (Spacing System)
Quy định các bước nhảy khoảng cách (padding, margin, gap) theo bội số của 4 để đảm bảo UI không bị lộn xộn và có tính nhất quán cao.

- **4px (xs):** Dùng cho khoảng cách cực nhỏ.
- **8px (sm):** Dùng cho khoảng cách nhỏ.
- **12px (md):** Dùng cho padding nhỏ.
- **16px (lg):** Mặc định cho padding chung.
- **24px (xl):** Dùng cho khoảng cách lớn.
- **32px (2xl):** Dùng cho khoảng cách rất lớn.

**Ví dụ hiển thị:**
<div style="display: flex; gap: 16px; margin-top: 8px;">
  <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;"><div style="width: 32px; height: 32px; background: #e2e8f0; padding: 4px;"><div style="width: 100%; height: 100%; background: #2563eb;"></div></div><span style="font-size: 12px;">4px</span></div>
  <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;"><div style="width: 32px; height: 32px; background: #e2e8f0; padding: 8px;"><div style="width: 100%; height: 100%; background: #2563eb;"></div></div><span style="font-size: 12px;">8px</span></div>
  <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;"><div style="width: 32px; height: 32px; background: #e2e8f0; padding: 12px;"><div style="width: 100%; height: 100%; background: #2563eb;"></div></div><span style="font-size: 12px;">12px</span></div>
</div>

### 4.2. Hệ thống Z-index (Z-index Scale)
Quy định để tránh lỗi đè component khi hệ thống phức tạp (VD: Dropdown bị che bởi Header).

| Thành phần | Giá trị Z-index | Ghi chú |
| :--- | :--- | :--- |
| **Base** | `0` | Các thành phần cơ bản trên trang |
| **Dropdown / Popover** | `10` | Menu thả xuống |
| **Sticky Header / Navbar** | `50` | Thanh điều hướng cố định |
| **Modal / Dialog / Drawer** | `100` | Hộp thoại nổi lên giữa màn hình |
| **Toast / Notification** | `200` | Thông báo |
| **Tooltip** | `300` | Ghi chú khi hover |

---

## 5. Các Component Chung (Common Components)

Dưới đây là danh sách các component đã được xây dựng và cần tuân thủ thống nhất:

### 5.1. Nút bấm (Button)
- **Primary:** Nền xanh, chữ trắng. Dùng cho hành động xác nhận chính.
- **Outline:** Viền mỏng, không nền. Dùng cho hành động phụ.
- **Ghost:** Không viền, không nền. Dùng cho các hành động trong menu hoặc bảng.
- **Destructive:** Nền đỏ, chữ trắng. Chỉ dùng cho hành động xóa.
- **Disabled (Vô hiệu hóa):** Trạng thái không thể tương tác. Nền và chữ mờ đi (opacity: 0.5), con trỏ chuột chuyển sang `not-allowed`.

**Ví dụ hiển thị:**
<div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
  <button style="background: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Lưu lại (Primary)</button>
  <button style="background: white; color: #020817; padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-weight: 500; cursor: pointer;">Hủy bỏ (Outline)</button>
  <button style="background: transparent; color: #020817; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Bỏ qua (Ghost)</button>
  <button style="background: #dc2626; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Xóa (Destructive)</button>
  <button style="background: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: not-allowed; opacity: 0.5;">Lưu lại (Disabled)</button>
</div>

### 5.2. Ô nhập liệu (Input & Textarea)
- Chiều cao mặc định: 40px.
- Bo góc: 8px (radius-md).
- Border: 1px solid `border`.
- Trạng thái Focus: Hiển thị ring màu `primary`.
- **Disabled (Vô hiệu hóa):** Trạng thái không thể nhập liệu. Nền xám nhạt (`bg-slate-100`), chữ mờ (`opacity-50`), con trỏ `not-allowed`.
- **Trường bắt buộc (Required):** Nhãn đi kèm dấu sao đỏ (`*`). Khi có lỗi (validation), border chuyển sang màu `destructive` (#dc2626) và hiển thị thông báo lỗi cỡ 12px bên dưới.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: flex; gap: 16px; flex-wrap: wrap;">
  <div>
    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #020817;">Họ và tên</label>
    <input type="text" placeholder="Nhập họ và tên..." style="width: 100%; max-width: 350px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none;" />
  </div>
  <div>
    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #64748b;">Mã định danh (Disabled)</label>
    <input type="text" value="ID_00123" disabled style="width: 100%; max-width: 350px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none; background: #f1f5f9; color: #64748b; cursor: not-allowed; opacity: 0.8;" />
  </div>
  <div>
    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #dc2626;">Email <span style="color: #dc2626;">*</span></label>
    <input type="text" value="email-khong-hop-le" style="width: 100%; max-width: 350px; padding: 8px 12px; border: 1px solid #dc2626; border-radius: 6px; font-size: 14px; outline: none; background: #fef2f2;" />
    <span style="display: block; font-size: 12px; color: #dc2626; margin-top: 4px;">Email không đúng định dạng</span>
  </div>
</div>

**Minh họa trường bắt buộc và lỗi validation:**
![Ví dụ trường bắt buộc](temp_images/mandatory_input_example.png)

### 5.3. Bảng dữ liệu (Table)
- Header: Nền xám nhạt (`muted`), chữ in đậm. Có quy định **Sticky Header** (Cố định tiêu đề khi cuộn) đối với các bảng dài.
- Row: Hiển thị hover effect khi di chuột qua.
- Cell: Padding 12px 16px.
- **Cột hành động (Action Column):** Nằm cuối cùng bên phải bảng. Các hành động (Sửa, Xóa) hiển thị dạng icon hoặc menu dropdown (dấu 3 chấm) nếu có quá nhiều hành động.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; max-width: 500px;">
  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
    <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <tr><th style="padding: 12px 16px; color: #64748b;">Mã</th><th style="padding: 12px 16px; color: #64748b;">Tên</th><th style="padding: 12px 16px; color: #64748b;">Trạng thái</th><th style="padding: 12px 16px; text-align: right; color: #64748b;">Thao tác</th></tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 16px;">DL_001</td><td style="padding: 12px 16px;">Dữ liệu Dân cư</td><td style="padding: 12px 16px;"><span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Đang chạy</span></td><td style="padding: 12px 16px; text-align: right;"><span style="color: #64748b; cursor: pointer; display: inline-block; padding: 4px;">⋯</span></td></tr>
    </tbody>
  </table>
</div>

### 5.4. Hộp thoại (Dialog / Modal)
- Backdrop mặc định: Làm mờ nền 50% (`bg-black/50`).
- Tiêu đề: Luôn nằm ở phía trên bên trái.
- Nút đóng: Icon `X` ở góc trên bên phải.
- **Khi có Modal chồng nhau (Nested Modals):** Modal mở sau bắt buộc phải sinh ra một lớp Backdrop mới đè lên Modal trước đó, giữ nguyên độ mờ 50% để tạo chiều sâu và tập trung vào Modal hiện tại. Tuyệt đối không để vô tình đóng Modal 1 khi click ra ngoài Modal 2.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; position: relative; height: 250px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
  <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.2);"></div>
  <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: white; width: 300px; height: 150px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); opacity: 0.8; padding: 16px;">
    <h3 style="margin: 0 0 8px 0; font-size: 14px;">Modal 1 (Bị mờ đi)</h3>
  </div>
  <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.3);"></div>
  <div style="position: absolute; top: 60px; left: 50%; transform: translateX(-50%); background: white; width: 250px; padding: 16px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); z-index: 10;">
    <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #020817;">Modal 2 (Active)</h3>
    <p style="margin: 0; font-size: 12px; color: #475569;">Đang được tập trung vào với nền backdrop riêng.</p>
  </div>
</div>

### 5.5. Thông báo (Toast / Sonner)
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

### 5.6. Thẻ thông báo (Card)
- Dùng để gom nhóm thông tin, form hoặc hiển thị các chỉ số thống kê (Dashboard).
- Giao diện mặc định: Nền trắng, bo góc 8px, viền mỏng (`border-slate-200`), có bóng đổ nhẹ (`shadow-sm`).

**Ví dụ hiển thị:**
<div style="margin-top: 8px; padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); max-width: 300px;">
  <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 500; color: #64748b;">Tổng số Dữ liệu</h3>
  <p style="margin: 0; font-size: 24px; font-weight: 600; color: #020817;">1,245</p>
  <p style="margin: 4px 0 0 0; font-size: 12px; color: #16a34a;">+12% so với tháng trước</p>
</div>

### 5.7. Chọn giá trị (Select / Dropdown)
- Dùng cho các bộ lọc tìm kiếm hoặc form nhập liệu có danh sách cố định.
- Hiển thị icon chevron ở góc phải để nhận diện dễ dàng.

**Ví dụ hiển thị:**
<div style="margin-top: 8px;">
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 250px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: white; color: #020817; cursor: pointer;">
    <span>Chọn phòng ban...</span>
    <span style="color: #64748b; font-size: 10px;">▼</span>
  </div>
</div>

### 5.8. Nhãn trạng thái (Badge)
- Dùng để hiển thị trạng thái riêng lẻ hoặc phân loại mức độ (Cao, Trung bình, Thấp).
- Kiểu dáng: Nền nhạt, chữ đậm màu tương ứng, bo góc lớn (`rounded-full`).

**Ví dụ hiển thị:**
<div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
  <span style="background: #eff6ff; color: #2563eb; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Ưu tiên thấp</span>
  <span style="background: #fef08a; color: #ca8a04; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Ưu tiên TB</span>
  <span style="background: #fee2e2; color: #dc2626; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500;">Ưu tiên cao</span>
</div>

### 5.9. Thẻ chuyển hướng (Tabs)
- Dùng để tổ chức và chuyển đổi nội dung trên cùng một màn hình (VD: Tab Nội bộ / Bên ngoài).

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: inline-flex; background: #f1f5f9; padding: 4px; border-radius: 8px;">
  <div style="padding: 6px 16px; background: white; border-radius: 6px; font-size: 14px; font-weight: 500; color: #020817; box-shadow: 0 1px 2px rgba(0,0,0,0.05); cursor: pointer;">Dữ liệu Nội bộ</div>
  <div style="padding: 6px 16px; font-size: 14px; font-weight: 500; color: #64748b; cursor: pointer;">Bộ ngành ngoài</div>
</div>

### 5.10. Lọc theo khoảng thời gian (Date Range Picker)
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

### 5.11. Tìm kiếm thông minh (Combobox)
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

### 5.12. Checkbox, Radio Button & Toggle / Switch
- **Checkbox & Radio Button:** Dùng để chọn một hoặc nhiều. Có màu khi `checked` (thường là màu `primary`) và xám mờ khi `disabled`.
- **Toggle / Switch:** Dùng cho thao tác Bật/Tắt trạng thái hoặc cấp quyền. Thay thế cho Checkbox ở các cấu hình mang tính tức thời.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: flex; gap: 24px; align-items: center;">
  <div style="display: flex; align-items: center; gap: 8px;">
    <div style="width: 16px; height: 16px; border-radius: 4px; background: #2563eb; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">✓</div>
    <span style="font-size: 14px;">Đã chọn</span>
  </div>
  <div style="display: flex; align-items: center; gap: 8px;">
    <div style="width: 16px; height: 16px; border-radius: 50%; border: 4px solid #2563eb; background: white;"></div>
    <span style="font-size: 14px;">Radio chọn</span>
  </div>
  <div style="display: flex; align-items: center; gap: 8px;">
    <div style="width: 36px; height: 20px; border-radius: 20px; background: #2563eb; position: relative;">
      <div style="width: 16px; height: 16px; border-radius: 50%; background: white; position: absolute; right: 2px; top: 2px;"></div>
    </div>
    <span style="font-size: 14px;">Bật (Toggle)</span>
  </div>
</div>

### 5.13. Tải lên tệp (File Upload / Dropzone)
- Khu vực kéo thả tài liệu (VD: Import Excel/PDF).
- Giao diện có nét đứt (`border-dashed`), hiển thị icon tải lên ở giữa. Khi có tệp sẽ hiển thị tên tệp và icon Xóa.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px; text-align: center; background: #f8fafc; max-width: 400px;">
  <div style="font-size: 24px; color: #64748b; margin-bottom: 8px;">☁️</div>
  <p style="margin: 0; font-size: 14px; font-weight: 500; color: #020817;">Kéo thả file vào đây hoặc <span style="color: #2563eb; cursor: pointer;">Tải lên</span></p>
  <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Hỗ trợ: .xlsx, .pdf (Tối đa 10MB)</p>
</div>

### 5.14. Phân trang (Pagination)
- Nằm ở dưới cùng của Bảng dữ liệu.
- Cung cấp tính năng chọn trang, xem tổng số bản ghi và điều chỉnh số dòng hiển thị trên mỗi trang.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 14px; max-width: 600px; flex-wrap: wrap; gap: 12px;">
  <div style="display: flex; align-items: center; gap: 8px;">
    <span style="color: #64748b;">Hiển thị</span>
    <div style="padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px; background: white; display: flex; align-items: center; gap: 4px; cursor: pointer;">
      <span>10</span>
      <span style="font-size: 10px; color: #64748b;">▼</span>
    </div>
    <span style="color: #64748b;">bản ghi / trang</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 12px;">
    <span style="color: #64748b;">1 - 10 / 50</span>
    <div style="display: flex; gap: 4px;">
      <div style="padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; color: #94a3b8; cursor: not-allowed;">Trước</div>
      <div style="padding: 4px 12px; border: 1px solid #2563eb; background: #2563eb; color: white; border-radius: 4px; cursor: pointer;">1</div>
      <div style="padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; cursor: pointer;">2</div>
      <div style="padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; cursor: pointer;">Sau</div>
    </div>
  </div>
</div>

### 5.15. Đường dẫn (Breadcrumb)
- Giúp người dùng biết mình đang ở đâu trong hệ thống.
- Cấu trúc: `Trang chủ / Danh mục / Chi tiết`. Các mục trước có thể click, mục hiện tại in đậm và không click được.

**Ví dụ hiển thị:**
<div style="margin-top: 8px; font-size: 14px; display: flex; gap: 8px; color: #64748b;">
  <span style="cursor: pointer; color: #2563eb;">Trang chủ</span>
  <span>/</span>
  <span style="cursor: pointer; color: #2563eb;">Dữ liệu Dân cư</span>
  <span>/</span>
  <span style="font-weight: 500; color: #020817;">Chi tiết hồ sơ</span>
</div>

### 5.16. Trạng thái (Empty / Loading / Tooltip / Validation)
- **Trạng thái Rỗng (Empty State):** Bảng/danh sách không có dữ liệu. Hiển thị Icon to + Chữ mờ + Nút "Thêm mới".
- **Trạng thái Tải (Loading / Skeleton):** Spinner xoay hoặc khung xám nhấp nháy (skeleton) trong lúc chờ API.
- **Tooltip:** Hiển thị thông tin giải thích khi hover vào icon button (VD: Icon Trash hiện chữ "Xóa bản ghi").
- **Thông báo Lỗi Input (Validation Form):** Dòng chữ báo lỗi màu đỏ nằm ngay dưới ô Input, viền ô Input cũng chuyển sang đỏ.

**Ví dụ hiển thị (Empty State & Validation):**
<div style="display: flex; gap: 24px; margin-top: 8px; flex-wrap: wrap;">
  <div style="border: 1px dashed #cbd5e1; padding: 24px; text-align: center; border-radius: 8px; background: #f8fafc; flex: 1; min-width: 200px;">
    <div style="font-size: 24px; color: #94a3b8; margin-bottom: 8px;">📂</div>
    <p style="margin: 0; font-size: 14px; font-weight: 500;">Không có dữ liệu</p>
    <button style="margin-top: 8px; background: white; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 12px; color: #020817; cursor: pointer;">+ Thêm mới</button>
  </div>
  <div style="flex: 1; min-width: 200px;">
    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #dc2626;">Mã dữ liệu *</label>
    <input type="text" value="" style="width: 100%; padding: 8px 12px; border: 1px solid #dc2626; border-radius: 6px; font-size: 14px; outline: none; background: #fef2f2;" />
    <span style="display: block; font-size: 12px; color: #dc2626; margin-top: 4px;">Mã dữ liệu không được để trống</span>
  </div>
</div>

---

## 6. Quy định chung về giao diện Trình duyệt & Duyệt

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
