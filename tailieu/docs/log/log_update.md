# Nhật ký cập nhật hệ thống (Changelog)

## Phiên bản 2.4.5 (Ngày cập nhật: 15/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn giao diện Tab Danh sách tài khoản:** Gỡ bỏ layout 2 cột (Dual-pane) chứa danh sách đơn vị. Chuyển sang hiển thị dạng bảng phẳng (Flat Table) danh sách toàn bộ tài khoản. Bổ sung cột "Đơn vị được cấp quyền" vào bảng để dễ bề theo dõi.
2. **Cập nhật dữ liệu Mock theo cấu trúc chính quyền 2 cấp:** Loại bỏ hoàn toàn các dữ liệu mẫu liên quan đến cấp Quận/Huyện ("UBND Huyện Tiên Du") trên toàn bộ các tab và modal chức năng.
3. **Đồng bộ hiển thị 2 tab API Cung cấp và API Đối soát:** 
   - Tab "API Đối soát dữ liệu" được bổ sung cột "Tài liệu" và nút thao tác "Lịch sử phiên bản" để tương thích giao diện với tab Cung cấp.
   - Bổ sung thêm cột "Phiên bản" (version badge) cho bảng danh sách của cả 2 tab.
4. **Nâng cấp trải nghiệm (UX) tính năng Làm mới Token (Refresh App Key):**
   - Loại bỏ các hộp thoại xác nhận `window.confirm` và `alert` mặc định của hệ điều hành/trình duyệt.
   - Xây dựng hệ thống Custom Modal UI bao gồm: Modal xác nhận (cảnh báo nguy cơ hệ thống mất kết nối) và Modal cấp mã mới (hỗ trợ hiển thị key và nút sao chép nhanh vào clipboard).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.4.4 -> 2.4.5)
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
