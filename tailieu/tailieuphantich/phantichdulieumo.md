# 4.8. PM08.DLMO_Dữ liệu mở (Open Data)

## 4.8.1. PM08.DLMO.TL – Thiết lập danh mục dữ liệu mở

### *4.8.1.1. Mục đích*
Quản lý vòng đời của các bộ dữ liệu mở, từ khâu tạo mới hồ sơ, cập nhật thông tin, cho đến khi trình lãnh đạo xem xét, phê duyệt. Chức năng này là bước đầu tiên để chuẩn bị cho việc công bố dữ liệu ra bên ngoài.

### 4.8.1.2. PM08.DLMO.TL.MH01 – Danh sách thiết lập dữ liệu mở
#### 4.8.1.2.1. MH01 Màn hình danh sách thiết lập dữ liệu mở
##### Màn hình
- Màn hình:

![Thiết lập danh mục dữ liệu mở](./images/thietlapdanhmuc_dlm.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Giao diện danh sách thiết lập dữ liệu mở</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup để tạo mới một hồ sơ dữ liệu mở (MH01.P01). |
| 2 | CN02 | Button icon | Mở popup cập nhật thông tin (MH01.P01). |
| 3 | CN03 | Button icon | Mở popup xác nhận để loại bỏ hồ sơ (MH01.P02). |
| 4 | CN04 | Button icon | Mở popup xác nhận gửi phê duyệt (MH01.P03). |

#### 4.8.1.2.2. MH01.P01 – Thêm/Sửa hồ sơ dữ liệu mở
##### Màn hình
- Màn hình:

![Thêm sửa dữ liệu mở](./images/themsua_dlmo.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình tạo mới hoặc cập nhật thông tin dữ liệu mở</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã danh mục | VARCHAR2(50) | Có | - | Mã định danh duy nhất của bộ dữ liệu mở. |
| Tên danh mục | VARCHAR2(255) | Có | - | Tên hiển thị (VD: Danh mục hiệu thuốc, Danh mục trường học). |
| Đơn vị quản lý | VARCHAR2(255) | Có | - | Đơn vị chịu trách nhiệm cung cấp dữ liệu. |
| Lĩnh vực | VARCHAR2(100) | Có | - | Lọc theo lĩnh vực (Y tế, Giáo dục, Kinh tế...). |
| Mô tả | VARCHAR2(1000)| Không | - | Nội dung tóm tắt của bộ dữ liệu. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu thông tin hồ sơ và đóng popup. |
| 2 | CN02 | Button text | Hủy thao tác. |

#### 4.8.1.2.3. MH01.P02 – Xác nhận xóa hồ sơ
##### Màn hình
- Màn hình:

![Xác nhận xóa hồ sơ](./images/confirm_delete_opendata.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Popup xác nhận xóa hồ sơ dữ liệu mở</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn xóa hồ sơ này? Hành động này sẽ gỡ bỏ các thiết lập hiện tại." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận xóa hồ sơ. |
| 2 | CN02 | Button text | Hủy thao tác. |

#### 4.8.1.2.4. MH01.P03 – Xác nhận gửi phê duyệt
##### Màn hình
- Màn hình:

![Xác nhận gửi phê duyệt mở](./images/confirm_submit_opendata.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Popup xác nhận gửi phê duyệt hồ sơ dữ liệu mở</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn gửi phê duyệt hồ sơ này? Hệ thống sẽ không cho phép sửa đổi sau khi gửi." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Gửi phê duyệt hồ sơ. |
| 2 | CN02 | Button text | Hủy bỏ. |


## 4.8.2. PM08.DLMO.PD – Phê duyệt và Công bố

### *4.8.2.1. Mục đích*
... (giữ nguyên)

### 4.8.2.2. PM08.DLMO.PD.MH02 – Giao diện Phê duyệt
#### 4.8.2.2.1. MH02 Màn hình giao diện Phê duyệt
##### Màn hình
- Màn hình:

![Giao diện phê duyệt dữ liệu mở](./images/pheduyet_dlm.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Màn hình phê duyệt nội dung bộ dữ liệu mở</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận duyệt hồ sơ, chuyển trạng thái bộ dữ liệu sang "Đã phê duyệt". |
| 2 | CN02 | Button text | Mở popup từ chối phê duyệt (MH02.P01). |

#### 4.8.2.2.2. MH02.P01 – Từ chối phê duyệt
##### Màn hình
- Màn hình:

![Từ chối phê duyệt dữ liệu mở](./images/tuchoi_pheduyet_dlm.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Popup nhập lý do từ chối phê duyệt dữ liệu mở</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Hồ sơ từ chối | VARCHAR2(255) | - | - | Tên hồ sơ dữ liệu mở đang được xét duyệt. |
| Lý do từ chối | CLOB | Có | - | Lý do hoặc nội dung cần chỉnh sửa lại. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Gửi thông tin từ chối và thông báo cho người lập. |
| 2 | CN02 | Button text | Hủy bỏ và quay lại màn hình phê duyệt. |

### 4.8.2.3. PM08.DLMO.PD.MH03 – Giao diện Công bố
... (giữ nguyên)

## 4.8.3. PM08.DLMO.BC – Báo cáo và Thống kê

... (giữ nguyên)
