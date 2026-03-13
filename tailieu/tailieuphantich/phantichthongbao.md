# 4.9. PM09.QLTB_Quản lý thông báo (Notifications)

## 4.9.1. PM09.QLTB.DS – Quản lý danh sách thông báo

### *4.9.1.1. Mục đích*
Chức năng này hoạt động như một trung tâm kiểm soát, cho phép người dùng theo dõi toàn bộ các sự kiện, cảnh báo, thông báo lỗi hoặc tiến độ công việc phát sinh từ các phân hệ khác trong hệ thống Kho DLDC, giúp nắm bắt tình hình hoạt động của hệ thống một cách kịp thời.

### 4.9.1.2. PM09.QLTB.DS.MH01 – Giao diện Quản lý thông báo

#### 4.9.1.2.1. MH01 Màn hình quản lý thông báo
##### Màn hình
- Màn hình:

![Giao diện Quản lý thông báo](./images/quanly_thongbao.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Giao diện danh sách và quản lý thông báo</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button icon | Mở popup để hiển thị toàn bộ nội dung chi tiết của thông báo (MH01.P01). |
| 2 | CN02 | Button icon | Đánh dấu, chuyển trạng thái của một thông báo từ "Chưa đọc" sang "Đã đọc". |
| 3 | CN03 | Button icon | Mở popup xác nhận xóa một thông báo (MH01.P02). |

#### 4.9.1.2.2. MH01.P01 – Chi tiết thông báo
##### Màn hình
- Màn hình:

![Popup chi tiết thông báo](./images/chitiet_thongbao.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Cửa sổ chi tiết nội dung thông báo</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thông tin chung | CLOB | - | - | Khu vực hiển thị các thông tin tổng quan: loại thông báo (Icon), Tiêu đề, Thời gian và Nguồn phát sinh. |
| Mức độ ưu tiên | VARCHAR2(20) | - | - | Hiển thị nhãn cảnh báo rõ ràng (ví dụ: "Ưu tiên cao"). |
| Nội dung đầy đủ | CLOB | - | - | Hiển thị toàn văn thông điệp chi tiết mà hệ thống đã gửi. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Chức năng "Đánh dấu đã đọc" (chỉ hiển thị với các thông báo chưa đọc). |
| 2 | CN02 | Button text | Đóng Popup chi tiết. |

#### 4.9.1.2.3. MH01.P02 – Xác nhận xóa thông báo
##### Màn hình
- Màn hình:

![Xác nhận xóa thông báo](./images/confirm_delete_notif.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Popup xác nhận xóa thông báo khỏi danh sách cá nhân</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn xóa thông báo này? Hành động này sẽ loại bỏ thông báo khỏi danh sách của bạn." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận xóa thông báo. |
| 2 | CN02 | Button text | Hủy thao tác. |
