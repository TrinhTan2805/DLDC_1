# 4.5. PM05.QLDLC_Dữ liệu chủ (Master Data)

## 4.5.1. PM05.QLDLC.QL – Quản lý thực thể dữ liệu chủ

### *4.5.1.1. Mục đích*
Quản lý các thực thể dữ liệu gốc dùng chung (ví dụ: Người dân, Tổ chức, Hộ gia đình...) nhằm đảm bảo tính duy nhất, chính xác và nhất quán trên toàn hệ thống. Chức năng này cho phép định nghĩa cấu trúc, các thuộc tính, và các quy tắc (định danh, hợp nhất, quan hệ) cho mỗi thực thể dữ liệu chủ.

### 4.5.1.2. PM05.QLDLC.QL.MH01 – Danh sách thực thể dữ liệu chủ

#### 4.5.1.2.1. MH01 Màn hình danh sách thực thể dữ liệu chủ (Cần bổ sung)
##### Màn hình
- Màn hình:

*(Chèn hình ảnh màn hình Danh sách thực thể dữ liệu chủ tại đây)*

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên thực thể | VARCHAR2(255) | - | - | Tên của thực thể dữ liệu chủ (VD: Người dân, Doanh nghiệp). |
| Mô tả | VARCHAR2(1000)| - | - | Mô tả ngắn về mục đích của thực thể. |
| Số thuộc tính | NUMBER | - | - | Số lượng trường thông tin đã được định nghĩa cho thực thể. |
| Ngày tạo | DATE | - | - | Ngày thực thể được tạo ra trong hệ thống. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup để tạo một thực thể mới. |
| 2 | CN02 | Button icon | Mở popup quản lý các thuộc tính của thực thể (MH01.P01). |
| 3 | CN03 | Button icon | Mở popup quản lý quy tắc định danh duy nhất (MH01.P02). |
| 4 | CN04 | Button icon | Mở popup quản lý quy tắc hợp nhất dữ liệu (MH01.P03). |
| 5 | CN05 | Button icon | Mở popup thiết lập quan hệ cho thực thể (MH01.P04). |
| 6 | CN06 | Button icon | Mở popup xác nhận xóa một thực thể. |

#### 4.5.1.2.2. MH01.P01 – Quản lý thuộc tính
##### Màn hình
- Màn hình:

![Popup Quản lý thuộc tính](./images/quanlythuoc_tinh.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Màn hình quản lý thuộc tính dữ liệu chủ</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên thuộc tính | VARCHAR2(255) | Có | - | Tên hiển thị của trường thông tin (VD: Căn cước công dân, Họ và tên). |
| Mã thuộc tính | VARCHAR2(50) | Có | - | Mã định danh kỹ thuật duy nhất của trường (viết liền, không dấu). |
| Kiểu dữ liệu | VARCHAR2(50) | Có | VARCHAR2 | Lựa chọn: VARCHAR2, NUMBER, DATE, CLOB, v.v. |
| Độ dài | NUMBER | Không | - | Giới hạn số ký tự tối đa cho phép. |
| Bắt buộc | NUMBER(1) | Không | 0 | Quy định trường có bắt buộc nhập hay không (1: Có / 0: Không). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thêm mới hoặc cập nhật thông tin thuộc tính vào danh sách. |
| 2 | CN02 | Button text | Đóng Popup không lưu thay đổi. |

#### 4.5.1.2.3. MH01.P02 – Quy tắc định danh duy nhất
##### Màn hình
- Màn hình:

![Quy tắc định danh duy nhất](./images/quytacdinhdanh.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Màn hình thiết lập quy tắc định danh duy nhất</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

#### 4.5.1.2.4. MH01.P03 – Quy tắc hợp nhất dữ liệu
##### Màn hình
- Màn hình:

![Quy tắc hợp nhất dữ liệu](./images/quytachopnhat.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình thiết lập quy tắc hợp nhất dữ liệu</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

#### 4.5.1.2.5. MH01.P04 – Thiết lập quan hệ thực thể
##### Màn hình
- Màn hình:

![Thiết lập quan hệ thực thể](./images/thietlapquanhe.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Màn hình thiết lập quan hệ thực thể</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)


## 4.5.2. PM05.QLDLC.CD – Cập nhật & Công khai dữ liệu chủ

### *4.5.2.1. Mục đích*
Quản lý vòng đời của các bản ghi dữ liệu chủ, bao gồm việc rà soát, phê duyệt các bản ghi mới hoặc được cập nhật, xử lý trùng lặp và cấu hình việc công khai dữ liệu ra bên ngoài thông qua API.

### 4.5.2.2. PM05.QLDLC.CD.MH02 – Cập nhật dữ liệu chủ
#### 4.5.2.2.1. MH02 Màn hình Cập nhật dữ liệu chủ
##### Màn hình
- Màn hình:

![Cập nhật dữ liệu chủ](./images/capnhatdulieuchu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Màn hình quy trình cập nhật dữ liệu chủ</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Danh sách bản ghi | CLOB | - | - | Hiển thị tổng quan các bản ghi đang chờ rà soát, phê duyệt. |
| Phát hiện trùng lặp | CLOB | - | - | Hệ thống đưa ra cảnh báo về các bản ghi có khả năng trùng lặp. |
| Rà soát thay đổi | CLOB | - | - | Giao diện so sánh giá trị cũ và giá trị mới của từng trường thông tin. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup so sánh và hợp nhất các bản ghi trùng lặp (MH02.P01). |
| 2 | CN02 | Button text | Xác nhận cập nhật bản ghi vào kho Dữ liệu chủ chính thức. |
| 3 | CN03 | Button text | Bỏ qua các thay đổi và không cập nhật bản ghi. |

#### 4.5.2.2.2. MH02.P01 – So sánh và hợp nhất
##### Màn hình
- Màn hình:

![So sánh hợp nhất](./images/sosanhhopnhat_master.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 7 - Giao diện so sánh dữ liệu trùng lặp và chọn giá trị chuẩn</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Danh sách thuộc tính | CLOB | - | - | Hiển thị side-by-side các giá trị từ 2 hoặc nhiều bản ghi trùng lặp. |
| Giá trị lựa chọn | VARCHAR2(1000) | Có | - | Người dùng chọn giá trị chính xác (Golden record) cho từng thuộc tính. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thực hiện hợp nhất các bản ghi dựa trên các giá trị đã chọn. |
| 2 | CN02 | Button text | Hủy bỏ và đóng popup. |
| 3 | CN03 | Button text | Đánh dấu không phải bản ghi trùng lặp. |

### 4.5.2.3. PM05.QLDLC.CD.MH03 – Công khai dữ liệu chủ
#### 4.5.2.3.1. MH03 Màn hình Công khai dữ liệu chủ
##### Màn hình
- Màn hình:

![Công khai dữ liệu chủ](./images/congkhaidulieuchu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Màn hình thiết lập công khai dữ liệu chủ</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)
