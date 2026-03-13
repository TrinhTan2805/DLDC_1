# 4.2. PM02.QLTT_Quản lý thu thập

## 4.2.1. PM02.QLTT.DB – Dashboard thu thập dữ liệu

### *4.2.1.1. Mục đích*
Cung cấp một cái nhìn tổng quan về tình hình thu thập dữ liệu từ tất cả các nguồn trong và ngoài ngành. Dashboard giúp cán bộ quản lý nhanh chóng nắm bắt được số lượng bản ghi đã thu thập, phân bổ theo nguồn và theo dõi các chỉ số chính về chất lượng dữ liệu.

### 4.2.1.2. PM02.QLTT.DB.MH01 – Dashboard thu thập dữ liệu

#### 4.2.1.2.1. MH01 Màn hình Dashboard thu thập dữ liệu
... (giữ nguyên)

## 4.2.2. PM02.QLTT.TL – Thiết lập thu thập

### *4.2.2.1. Mục đích*
Quản lý vòng đời của các cấu hình thu thập dữ liệu từ các hệ thống nguồn. Chức năng này cho phép người dùng định nghĩa, tạo mới, chỉnh sửa, xóa và kiểm thử các kết nối đến API hoặc nguồn dữ liệu, cũng như lên lịch thu thập tự động.

### 4.2.2.2. PM02.QLTT.TL.MH02 – Danh sách thiết lập dịch vụ thu thập

#### 4.2.2.2.1. MH02 Màn hình danh sách thiết lập dịch vụ thu thập
##### Màn hình
- Màn hình:

![Thiết lập thu thập](./images/thietlapthuthap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Màn hình danh sách thiết lập dịch vụ thu thập</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup thêm mới/sửa một dịch vụ thu thập (MH02.P01). |
| 2 | CN02 | Button icon | Mở popup xem chi tiết dịch vụ (MH02.P02). |
| 3 | CN03 | Button icon | Mở popup xác nhận xóa dịch vụ (MH02.P03). |
| 4 | CN04 | Button icon | Mở popup cài đặt nâng cao cho dịch vụ (MH02.P04). |
| 5 | CN05 | Button text | Mở popup kết quả kiểm thử endpoint (MH02.P05). |

#### 4.2.2.2.2. MH02.P01 – Thêm/Sửa dịch vụ thu thập
##### Màn hình
- Màn hình:

![Thêm sửa dịch vụ thu thập](./images/themsua_thuthap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Giao diện cấu hình dịch vụ thu thập dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên dịch vụ | VARCHAR2(255) | Có | - | Tên gợi nhớ của dịch vụ thu thập. |
| Đơn vị cung cấp | VARCHAR2(255) | Có | - | Chọn đơn vị (Bộ/Ngành, Tỉnh/Thành) cung cấp dữ liệu. |
| Cấu hình kết nối | CLOB | Có | - | Endpoint URL, Phương thức xác thực (API Key, OAuth2). |
| Chu kỳ thu thập | VARCHAR2(50) | Có | - | Thiết lập lịch chạy: Hàng ngày, Hàng tuần, Định kỳ X phút. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu thông tin cấu hình và đóng popup. |
| 2 | CN02 | Button text | Hủy thao tác. |

#### 4.2.2.2.3. MH02.P02 – Chi tiết dịch vụ
##### Màn hình
- Màn hình:

![Xem chi tiết dịch vụ](./images/thietlapthuthap_xemchitiet.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Màn hình chi tiết cấu hình dịch vụ thu thập</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Trạng thái kết nối | VARCHAR2(50) | - | - | Kết nối thành công/Thất bại tại thời điểm hiện tại. |
| Lần chạy cuối | DATE | - | - | Thời gian gần nhất dịch vụ thực hiện thu thập. |
| Tổng bản ghi | NUMBER | - | - | Tổng số dữ liệu đã thu thập được từ nguồn này. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup. |

#### 4.2.2.2.4. MH02.P03 – Xác nhận xóa dịch vụ
##### Màn hình
- Màn hình:

![Xóa dịch vụ](./images/thietlapthuthap_xoadichvu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Màn hình xác nhận xóa dịch vụ thu thập</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn xóa dịch vụ này không? Dữ liệu cấu hình sẽ bị gỡ bỏ vĩnh viễn." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận xóa. |
| 2 | CN02 | Button text | Hủy. |

#### 4.2.2.2.5. MH02.P04 – Cài đặt nâng cao
##### Màn hình
- Màn hình:

![Cài đặt dịch vụ](./images/thietlapthuthap_caitatdichvu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Giao diện thiết lập các tham số vận hành đặc thù (Authention, Timeout...)</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Timeout | NUMBER | Không | 30 | Thời gian chờ tối đa (giây) cho mỗi yêu cầu thu thập. |
| Số lần thử lại | NUMBER | Không | 3 | Số lần hệ thống tự động gọi lại nếu gặp lỗi kết nối. |
| Tham số nâng cao | CLOB | Không | - | Cấu hình các tham số Header hoặc Body đặc thù theo API nguồn. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu các thay đổi cài đặt nâng cao. |
| 2 | CN02 | Button text | Đóng popup. |

#### 4.2.2.2.6. MH02.P05 – Kết quả kiểm thử
##### Màn hình
- Màn hình:

![Kết quả kiểm thử](./images/test_endpoint_result.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 7 - Popup hiển thị phản hồi từ endpoint khi kiểm tra kết nối</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Trang thái HTTP | NUMBER | - | - | Mã trạng thái trả về (VD: 200 OK, 404 Not Found). |
| Nội dung phản hồi | CLOB | - | - | Dữ liệu thô (JSON/XML) nhận được từ API. |
| Thời gian phản hồi | NUMBER | - | - | Tốc độ phản hồi của endpoint (tính bằng ms). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thử lại việc gửi yêu cầu kiểm tra. |
| 2 | CN02 | Button text | Đóng popup. |

## 4.2.3. PM02.QLTT.NK – Quản lý nhật ký

### *4.2.3.1. Mục đích*
... (giữ nguyên)

### 4.2.3.2. PM02.QLTT.NK.MH03 – Quản lý nhật ký

#### 4.2.3.2.1. MH03 Màn hình quản lý nhật ký
... (giữ nguyên)
##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xuất nhật ký ra file Excel. |
| 2 | CN02 | Icon | Mở popup chi tiết nhật ký (MH03.P01). |
| 3 | CN03 | Input | Tìm kiếm trong nhật ký. |

#### 4.2.3.2.2. MH03.P01 – Chi tiết nhật ký
##### Màn hình
- Màn hình: 

![Chi tiết nhật ký](./images/chitiet_nhatky_thuthap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 8 - Màn hình hiển thị chi tiết nội dung sự kiện nhật ký</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thời gian | DATE | - | - | Thời điểm ghi nhận log chính xác. |
| Thiết bị | VARCHAR2(255) | - | - | Thông tin về hệ điều hành, trình duyệt thực hiện. |
| Nội dung chi tiết | CLOB | - | - | Diễn giải đầy đủ về hành động, thông số API gửi/nhận hoặc mã lỗi. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup. |
| 2 | CN02 | Button text | Sao chép nội dung nhật ký vào bộ nhớ tạm. |

## 4.2.4. PM02.QLTT.DS – Đối soát dữ liệu

### *4.2.4.1. Mục đích*
... (giữ nguyên)

### 4.2.4.2. PM02.QLTT.DS.MH04 – Đối soát dữ liệu

#### 4.2.4.2.1. MH04 Màn hình danh sách đối soát dữ liệu
... (giữ nguyên)
##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xuất báo cáo kết quả đối soát. |
| 2 | CN02 | Button icon | Khởi chạy tiến trình đối soát thủ công. |
| 3 | CN03 | Button icon | Xem chi tiết các bản ghi bất thường (MH04.P01). |
| 4 | CN04 | Button text | Mở popup thiết lập gói tin đối soát LGSP (MH04.P02). |
| 5 | CN05 | Button text | Mở popup gửi thông báo đối soát (MH04.P03). |

#### 4.2.4.2.2. MH04.P01 Chi tiết bản ghi bất thường
... (giữ nguyên)

#### 4.2.4.2.3. MH04.P02 – Thiết lập gói tin đối soát LGSP
##### Màn hình
- Màn hình:

![Thiết lập LGSP](./images/config_lgsp_reconciliation.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 9 - Popup cấu hình tham số đối soát qua trục LGSP</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã dịch vụ LGSP | VARCHAR2(100) | Có | - | Mã định danh dịch vụ trên trục tích hợp. |
| Phương thức đối soát | VARCHAR2(50) | Có | - | Đối soát theo lô, đối soát theo thời gian thực... |
| Cấu hình gói tin | CLOB | Có | - | Định nghĩa các trường thông tin trong gói tin đối soát. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu cấu hình đối soát LGSP. |
| 2 | CN02 | Button text | Hủy và đóng popup. |

#### 4.2.4.2.4. MH04.P03 – Gửi thông báo đối soát
##### Màn hình
- Màn hình:

![Gửi thông báo đối soát](./images/send_recon_notif.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 10 - Giao diện soạn thảo thông báo kết quả đối soát dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Người nhận | VARCHAR2(1000) | Có | - | Danh sách email hoặc tài khoản nhận thông báo. |
| Tiêu đề | VARCHAR2(255) | Có | - | Tiêu đề thông báo đối soát. |
| Nội dung | CLOB | Có | - | Nội dung chi tiết về kết quả đối soát thành công/thất bại. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Gửi thông báo đến các bên liên quan. |
| 2 | CN02 | Button text | Hủy và đóng popup. |
