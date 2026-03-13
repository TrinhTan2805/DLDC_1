# 4.4. PM04.QLXL_Quản lý xử lý dữ liệu

## 4.4.1. PM04.QLXL.DB – Dashboard xử lý dữ liệu

### *4.4.1.1. Mục đích*
Cung cấp một bảng điều khiển trung tâm để theo dõi trạng thái, tiến độ và kết quả của các tiến trình làm sạch, chuẩn hóa và biến đổi dữ liệu. Dashboard giúp người quản trị có cái nhìn tổng quan về hiệu quả của các quy tắc xử lý và chất lượng dữ liệu sau khi được xử lý.

### 4.4.1.2. PM04.QLXL.DB.MH01 – Dashboard xử lý

#### 4.4.1.2.1. MH01 Màn hình Dashboard xử lý
##### Màn hình
- Màn hình:

![Dashboard Xử lý](./images/dashboard_xuly.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Giao diện tổng quan xử lý dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Giai đoạn 1: Làm sạch | NUMBER | - | - | Thống kê số lượng bản ghi đã qua giai đoạn làm sạch. |
| Giai đoạn 2: Chuẩn hóa | NUMBER | - | - | Thống kê số lượng bản ghi đã được chuẩn hóa. |
| Giai đoạn 3: Biến đổi | NUMBER | - | - | Thống kê số lượng bản ghi đã được biến đổi. |
| Quy tắc trong ngành | NUMBER | - | - | Số lượng quy tắc xử lý áp dụng cho dữ liệu nội bộ. |
| Quy tắc ngoài ngành | NUMBER | - | - | Số lượng quy tắc xử lý áp dụng cho dữ liệu từ bên ngoài. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Icon | Điều hướng đến màn hình chi tiết thiết lập quy tắc. |
| 2 | CN02 | Date Picker| Lọc dữ liệu trên dashboard theo khoảng thời gian. |

## 4.4.2. PM04.QLXL.QT – Thiết lập & Quản lý quy tắc

### *4.4.2.1. Mục đích*
Cho phép người dùng cấu hình chi tiết các quy tắc xử lý (làm sạch, chuẩn hóa, biến đổi) cho từng nguồn dữ liệu cụ thể, khởi chạy tiến trình xử lý hàng loạt và theo dõi kết quả, cũng như quản lý các bản ghi lỗi phát sinh.

### 4.4.2.2. PM04.QLXL.QT.MH02 – Danh sách cấu hình xử lý

#### 4.4.2.2.1. MH02 Màn hình Danh sách cấu hình xử lý
##### Màn hình
- Màn hình:

![Danh sách cấu hình xử lý](./images/danhsach_cauhin_xuly.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Bảng cấu hình quy tắc xử lý dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên dữ liệu xử lý | VARCHAR2(255) | - | - | Tên gợi nhớ (VD: Dữ liệu CSDL hộ tịch). |
| Nguồn dữ liệu | VARCHAR2(255) | - | - | CSDL gốc (VD: CSDL Hộ tịch Trung ương). |
| Người xử lý | VARCHAR2(255) | - | - | Cán bộ chịu trách nhiệm cấu hình. |
| Trạng thái | VARCHAR2(50) | - | - | Đang xử lý, Hoàn thành, Chờ xử lý, Lỗi. |
| Tiến độ | NUMBER(3,2) | - | - | Tỷ lệ bản ghi đã xử lý trên tổng số. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup để tạo một luồng xử lý mới. |
| 2 | CN02 | Button text | Mở popup quản lý quy tắc xử lý (MH02.P01). |
| 3 | CN03 | Button text | Mở popup phân loại và bảo mật dữ liệu (MH02.P02). |
| 4 | CN04 | Button text | Kích hoạt tiến trình xử lý hàng loạt theo quy tắc đã cấu hình. |
| 5 | CN05 | Button icon | Mở popup xem lịch sử các phiên xử lý (MH02.P04). |
| 6 | CN06 | Button icon | Mở popup xem danh sách các bản ghi bị lỗi (MH02.P03). |

#### 4.4.2.2.2. MH02.P01 – Quản lý Quy tắc Xử lý (Popup)
##### Màn hình
- Màn hình:

![Quản lý Quy tắc Xử lý](./images/quanly_quytac_xuly.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình quản lý các quy tắc làm sạch, chuẩn hóa, biến đổi</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Chọn trường áp dụng | NUMBER(1) | Có | - | Danh sách các cột dữ liệu trong bảng nguồn để áp dụng quy tắc. |
| Trạng thái áp dụng | NUMBER(1) | Có | 1 | Bật/Tắt việc sử dụng quy tắc này cho luồng xử lý. |
| Định dạng ngày tháng | VARCHAR2(100) | Không | - | Thiết lập quy tắc khớp chuỗi cho dữ liệu ngày/số. |
| Xử lý giá trị thiếu | VARCHAR2(50) | Không | - | Chọn hành động khi gặp trường rỗng (Bỏ qua, Điền giá trị mặc định...). |
| Xử lý trùng lặp | VARCHAR2(50) | Không | - | Chọn tiêu chí để xác định và gộp bản ghi trùng. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu lại các tùy chỉnh cho bộ quy tắc xử lý. |
| 2 | CN02 | Button text | Đóng popup. |

#### 4.4.2.2.3. MH02.P02 – Phân loại và Bảo mật dữ liệu (Popup)
##### Màn hình
- Màn hình:

![Phân loại và Bảo mật dữ liệu](./images/phanloai_baomat_dulieu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Cửa sổ phân loại và cấu hình bảo mật dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mức độ công khai | VARCHAR2(50) | Có | - | Công khai, Hạn chế, Nội bộ, Mật. |
| Mức độ nhạy cảm | VARCHAR2(50) | Có | - | Thấp, Trung bình, Cao, Rất cao. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu lại thiết lập phân loại và bảo mật. |
| 2 | CN02 | Button text | Đóng popup. |

#### 4.4.2.2.4. MH02.P03 – Danh sách Bản ghi Lỗi (Popup)
##### Màn hình
- Màn hình:

![Danh sách Bản ghi Lỗi](./images/danhsach_banghi_loi.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Màn hình danh sách bản ghi lỗi trong quá trình xử lý</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã bản ghi | VARCHAR2(50) | - | - | Mã định danh hồ sơ bị lỗi kỹ thuật. |
| Trường dữ liệu | VARCHAR2(50) | - | - | Tên cột phát sinh lỗi (VD: Email, CCCD). |
| Giá trị gốc | VARCHAR2(1000) | - | - | Dữ liệu sai lệch lấy từ hệ thống nguồn. |
| Loại lỗi | VARCHAR2(50) | - | - | Sai định dạng, Thiếu dữ liệu, Giá trị không hợp lệ. |
| Mô tả & Gợi ý | VARCHAR2(1000) | - | - | Giải thích chi tiết lỗi và giá trị đề xuất sửa đổi. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Yêu cầu sửa đổi hoặc gửi lại hệ thống nguồn. |
| 2 | CN02 | Button text | Xuất danh sách lỗi ra file Excel. |
| 3 | CN03 | Button text | Đóng popup. |

#### 4.4.2.2.5. MH02.P04 – Lịch sử Xử lý dữ liệu (Popup)
##### Màn hình
- Màn hình:

![Lịch sử Xử lý dữ liệu](./images/lichsu_xuly_dulieu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Giao diện lịch sử các phiên xử lý dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thời gian | DATE | - | - | Thời điểm bắt đầu phiên xử lý. |
| Loại xử lý | VARCHAR2(255) | - | - | Tên quy tắc hoặc nhóm quy tắc đã chạy. |
| Thống kê | VARCHAR2(1000) | - | - | Số bản ghi đã xử lý thành công/thất bại. |
| Trạng thái | VARCHAR2(50) | - | - | Hoạt động, Hoàn thành, Có lỗi. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup. |
| 2 | CN02 | Button icon | Xem chi tiết log của một phiên xử lý cụ thể. |
