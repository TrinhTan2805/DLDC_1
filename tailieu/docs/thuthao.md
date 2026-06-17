**BỘ TƯ PHÁP**

**CỤC CÔNG NGHỆ THÔNG TIN**

**Dự án: Các nền tảng số dùng chung Bộ Tư Pháp**

**TÀI LIỆU**

**PHÂN TÍCH THIẾT KẾ YÊU CẦU CHỨC NĂNG CHI TIẾT - MODULE THU THẬP (DC1-QLTT)**

**Phiên bản tài liệu: 1.0**

**Đơn vị quản lý: Cục Công nghệ thông tin – Bộ Tư pháp**

**Hà Nội - Năm 2026**

---

**LỊCH SỬ THAY ĐỔI**

| Ngày | Phiên bản | Người thực hiện | Mục, bảng sơ đồ được thay đổi | Lý do | Mô tả |
| --- | --- | --- | --- | --- | --- |
| 07/05/2026 | 1.0 | Antigravity AI | Toàn bộ | Tạo mới | Tạo mới tài liệu theo cấu trúc chuẩn |

---

**MỤC LỤC**

[1. TÓM TẮT](#1-tom-tat)
[1.1. Mục đích tài liệu](#11-muc-dich-tai-lieu)
[1.2. Tài liệu tham khảo](#12-tai-lieu-tham-khao)
[1.3. Thuật ngữ và từ viết tắt](#13-thuat-ngu-va-tu-viet-tat)
[2. MÔ HÌNH KIẾN TRÚC TỔNG THỂ PHẦN MỀM](#2-mo-hinh-kien-truc-tong-the-phan-mem)
[3. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ](#3-mo-hinh-quy-trinh-nghiep-vu)
[3.1. Quy trình quản lý thu thập](#31-quy-trinh-quan-ly-thu-thap)
[4. ĐẶC TẢ CHI TIẾT YÊU CẦU CHỨC NĂNG](#4-dac-ta-chi-tiet-yeu-cau-chuc-nang)
[4.1. DC1-TQ. Tổng quan (Dashboard)](#41-dc1-tq-tong-quan-dashboard)
[4.2. DC1-QLTT. Quản lý thu thập](#42-dc1-qltt-quan-ly-thu-thap)
[4.2.1. Thiết lập dịch vụ thu thập](#421-thiet-lap-dich-vu-thu-thap)
[4.2.2. Quản lý nhật ký hệ thống](#422-quan-ly-nhat-ky-he-thong)

---

# 1. TÓM TẮT

## 1.1. Mục đích tài liệu
- Đặc tả chi tiết yêu cầu chức năng cho Module Thu thập dữ liệu (DC1-QLTT).
- Làm căn cứ để xây dựng thiết kế chi tiết, lập trình và kiểm thử hệ thống.

## 1.2. Tài liệu tham khảo
- Luật Dữ liệu số 60/2024/QH15.
- Nghị định 47/2020/NĐ-CP về quản lý, kết nối và chia sẻ dữ liệu số.
- Tài liệu quy tắc nghiệp vụ Module Thu thập.

## 1.3. Thuật ngữ và từ viết tắt
| Thuật ngữ | Mô tả |
| --- | --- |
| BTP | Bộ Tư pháp |
| CSDL | Cơ sở dữ liệu |
| LGSP | Nền tảng tích hợp, chia sẻ dữ liệu cấp bộ |
| NDXP | Nền tảng tích hợp, chia sẻ dữ liệu quốc gia |
| DC1-QLTT | Module Quản lý Thu thập dữ liệu |

---

# 2. MÔ HÌNH KIẾN TRÚC TỔNG THỂ PHẦN MỀM

Module Thu thập thuộc lớp **Quản lý, thu thập dữ liệu** trong kiến trúc tổng thể, thực hiện kết nối với các hệ thống nội ngành và ngoài ngành thông qua LGSP/NDXP.

---

# 3. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ

## 3.1. Quy trình quản lý thu thập
| Bước | Tên bước | Đối tượng thực hiện | Mô tả vận hành |
| --- | --- | --- | --- |
| 1 | Thiết lập dịch vụ | Quản trị viên | Cấu hình thông số kết nối, tần suất và ánh xạ dữ liệu. |
| 2 | Kiểm tra kết nối | Hệ thống | Thử nghiệm bắt tay (handshake) với hệ thống nguồn. |
| 3 | Tiếp nhận dữ liệu | Hệ thống | Lấy dữ liệu theo lịch trình hoặc thời gian thực. |
| 4 | Kiểm tra & Ghi nhật ký | Hệ thống | Kiểm tra cấu trúc bản ghi và ghi vết vào log. |

---

# 4. ĐẶC TẢ CHI TIẾT YÊU CẦU CHỨC NĂNG

## 4.1. DC1-QTHT-QTHT-692.Màn đăng nhập
### Mục đích
Cho phép người sử dụng truy cập vào hệ thống Kho DLDC.

## 4.2. DC1-TQ. Tổng quan (Dashboard)
### Mục đích
Cung cấp cái nhìn trực quan về tình hình thu thập dữ liệu qua các chỉ số và biểu đồ.

### Màn hình Dashboard
![](images/dashboard_overview.png)

#### Mô tả thông tin trên màn hình
| STT | Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mô tả |
| --- | --- | --- | --- | --- |
| 1 | Tổng số bản ghi đã thu thập | Number | Có | Tổng lũy kế bản ghi thành công. |
| 2 | Xu hướng Thu thập | Chart | Có | Biểu đồ đường 12 tháng gần nhất. |
| 3 | Tỉ lệ theo Phương thức | Chart | Có | Biểu đồ cột: REST, SOAP, FTP, Upload. |

---

## 4.3. DC1-QLTT. Quản lý thu thập

### 4.3.1. Thiết lập dịch vụ thu thập
#### Mục đích
Cho phép quản trị viên cấu hình các thông số để tự động hóa việc kéo dữ liệu từ các nguồn khác nhau.

#### Màn hình Thêm mới/Chỉnh sửa (4 Tabs)
![](images/collection_setup_tabs.png)

##### Tab 1: Thông tin chung
| STT | Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mô tả |
| --- | --- | --- | --- | --- |
| 1 | Tên service | Text | Có | Tên định danh dịch vụ. |
| 2 | Nguồn thu thập | Dropdown | Có | Trong ngành / Ngoài ngành. |
| 3 | Mức độ bảo mật | Dropdown | Có | Mở, Nội bộ, Nhạy cảm... |

##### Tab 3: Cấu hình kết nối (Chi tiết kỹ thuật)
| STT | Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mô tả |
| --- | --- | --- | --- | --- |
| 1 | Phương thức kết nối | Dropdown | Có | API RESTful, SOAP, FTP, Database, Upload file. |
| 2 | Base URL | Text | Có (API) | Địa chỉ gốc của dịch vụ nguồn. |
| 3 | Ánh xạ trường | Grid | Có | Mapping giữa cột nguồn và cột đích trong kho. |

#### Chức năng trên màn hình
| STT | Tên chức năng | Định dạng | Mô tả |
| --- | --- | --- | --- |
| 1 | Test Connection | Button | Kiểm tra khả năng kết nối tới server nguồn. |
| 2 | Lưu lại | Button | Lưu toàn bộ cấu hình 4 Tabs vào hệ thống. |

### 4.3.2. Quản lý nhật ký hệ thống
#### Mục đích
Truy vết mọi hoạt động của người dùng và tiến trình đồng bộ tự động.

#### Mô tả thông tin nhật ký
| STT | Trường thông tin | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | Người dùng | Text | Tên đăng nhập và họ tên. |
| 2 | Hành động | Text | Loại thao tác (Thêm mới, Cập nhật...). |
| 3 | Thời gian | DateTime | Thời điểm xảy ra sự kiện. |
| 4 | Trạng thái | Badge | Thành công (Xanh) / Thất bại (Đỏ). |

---

## 5. YÊU CẦU PHI CHỨC NĂNG

### 5.1. Bảo mật
- Mã hóa dữ liệu nhạy cảm (AES-256).
- Phân quyền truy cập dựa trên vai trò (RBAC).

### 5.2. Hiệu năng
- Hỗ trợ phân trang (Pagination) cho các danh sách dữ liệu lớn.
- Sử dụng cơ chế Proxy Backend khi Test Connection để tránh lỗi CORS.
- Tối ưu hóa Worker xử lý đồng bộ theo lô (Batch Processing).

---

## 5. Thiết kế Dữ liệu (Data Design)

### 5.1. Các bảng chính
- `COLLECTION_SERVICES`: Lưu thông tin định danh dịch vụ.
- `SERVICE_CONTACTS`: Lưu thông tin đơn vị cung cấp.
- `SERVICE_CONNECTIONS`: Lưu cấu hình kết nối (trường `config_data` kiểu JSON).
- `SERVICE_SCHEDULES`: Lưu lịch trình đồng bộ.
- `SYSTEM_LOGS`: Lưu vết audit trail.

### 5.2. Cấu hình động (Dynamic Mapping)
Hệ thống sử dụng mảng JSON `mapping_schema` để tự động sinh script nạp dữ liệu vào bảng tạm, đảm bảo tính linh hoạt khi cấu trúc dữ liệu nguồn thay đổi.
