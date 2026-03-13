# 4.6. PM06.QLDLC_Điều phối dữ liệu (Data Orchestration/API)

## 4.6.1. PM06.QLDLC.TC – Quản lý API cung cấp dữ liệu

### *4.6.1.1. Mục đích*
Quản lý tập trung việc cung cấp, điều phối và chia sẻ dữ liệu thông qua các giao diện lập trình ứng dụng (API), nhằm đảm bảo an toàn, bảo mật, hiệu năng và khả năng kiểm soát toàn bộ luồng dữ liệu trao đổi.

### 4.6.1.2. PM06.QLDLC.TC.MH01 – Giao diện Quản lý API

#### 4.6.1.2.1. MH01 Màn hình quản lý API
##### Màn hình
- Màn hình:

![Giao diện Quản lý API](./images/quanlyapi.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Màn hình giao diện quản lý API</p>

##### Mô tả thông tin trên màn hình

**A. Nhóm Tab chức năng**
... (giữ nguyên)

**B. Các chỉ số thống kê cơ bản (Stats)**
... (giữ nguyên)

**C. Danh sách API (Data Table)**
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup để tạo mới/cập nhật một cấu hình API (MH01.P01). |
| 2 | CN02 | Search input | Tìm kiếm nhanh API theo tên, mã hoặc endpoint. |
| 3 | CN03 | Button text | Xuất danh sách API hiện tại ra các định dạng file (Excel, JSON, CSV, XML). |
| 4 | CN04 | Button icon | Mở popup xem toàn bộ thông tin cấu hình chi tiết của API (MH01.P01). |
| 5 | CN06 | Button icon | Chuyển đến màn hình giám sát, hiển thị biểu đồ và nhật ký riêng của API đó (MH02). |
| 6 | CN07 | Button icon | Mở công cụ kiểm thử API (API tester) để thực thi API trực tuyến (MH01.P02). |

#### 4.6.1.2.2. MH01.P01 – Cấu hình API
##### Màn hình
- Màn hình:

![Cấu hình API](./images/cauhin_api_popup.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình Cấu hình API</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Security | CLOB | - | - | Tab cấu hình bảo mật: Quản lý API Key, danh sách IP được phép (Whitelist). |
| Rate Limiting | CLOB | - | - | Tab cấu hình giới hạn: Số request mỗi phút/giờ/ngày/tháng. |
| Endpoint | CLOB | - | - | Tab cấu hình kỹ thuật: URL, Method, Timeout, Content-Type. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Ghi nhận và lưu lại cấu hình API. |
| 2 | CN02 | Button text | Đóng Popup mà không lưu thay đổi. |

#### 4.6.1.2.3. MH01.P02 – Kiểm tra API
##### Màn hình
- Màn hình:

![Kiểm tra API](./images/kiemtra_api_popup.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Màn hình thử nghiệm API</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Request | CLOB | - | - | Khu vực để người dùng nhập các thông tin của yêu cầu: URL, Header, Params, Body. |
| Response | CLOB | - | - | Khu vực hiển thị kết quả trả về từ API: Status code, Header và Body. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Gửi yêu cầu (Request) đến API endpoint đã nhập. |
| 2 | CN02 | Button text | Xóa toàn bộ dữ liệu đã nhập trong khu vực Request. |


## 4.6.2. PM06.QLDLC.GS – Giám sát và Nhật ký vận hành

### *4.6.2.1. Mục đích*
Theo dõi hiệu năng hệ thống, tình trạng của các API, và ghi nhận nhật ký vận hành để phân tích, xử lý sự cố và đảm bảo tính sẵn sàng, ổn định của toàn bộ hệ thống chia sẻ dữ liệu.

### 4.6.2.2. PM06.QLDLC.GS.MH02 – Dashboard Giám sát (Monitoring)

#### 4.6.2.2.1. MH02 Màn hình Dashboard Giám sát (Monitoring)
##### Màn hình
- Màn hình:

![Dashboard Giám sát](./images/dashboard_giamsat_giam_sat.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Màn hình Dashboard Giám sát (Monitoring)</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
... (giữ nguyên)

## 4.6.3. Luồng dữ liệu (Data Flow)

### *4.6.3.1. Sơ đồ luồng dữ liệu tổng quát*

```mermaid
graph TD
    subgraph "External Systems / Users"
        Consumer["API Consumer (Bên nhận)"]
        Provider["Data Provider (Bên cung cấp)"]
    end

    subgraph "Kho DLDC - Orchestration Layer"
        Manager["Quản lý API (Admin)"]
        Engine["Orchestration Engine (API Gateway)"]
        Monitor["Hệ thống Giám sát & Logs"]
        DB[("CSDL Cấu hình & Dữ liệu")]
    end

    %% Luồng quản trị
    Manager -- "Cấu hình / Xuất bản" --> DB
    DB -- "Tải cấu hình" --> Engine

    %% Luồng API Chủ động
    Engine -- "1. Gọi/Đẩy dữ liệu (Request)" --> Provider
    Provider -- "2. Trả kết quả (Response)" --> Engine
    Engine -- "3. Lưu trữ / Điều phối" --> DB

    %% Luồng API Thụ động
    Consumer -- "A. Gửi yêu cầu (Request)" --> Engine
    Engine -- "B. Truy vấn & Kiểm tra" --> DB
    Engine -- "C. Trả dữ liệu (Response)" --> Consumer

    %% Luồng giám sát
    Engine -- "Ghi nhật ký (Logs)" --> Monitor
    Monitor -- "Hiển thị Dashboard" --> Manager
```

### *4.6.3.2. Chi tiết các luồng dữ liệu*

| Loại luồng | Thành phần tham gia | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Luồng quản trị (Management)** | Cán bộ quản trị, CSDL cấu hình | Cán bộ quản trị thiết lập thông tin Endpoint, Phương thức, Bảo mật (API Key) và Trạng thái hoạt động của từng API. Các cấu hình này được lưu vào CSDL. |
| **Luồng API Chủ động (Active)** | Kho DLDC, Hệ thống nguồn | Hệ thống chủ động kích hoạt các yêu cầu lấy dữ liệu từ các CSDL chuyên ngành (Hộ tịch, ĐKKD...) theo lịch trình định kỳ hoặc theo sự kiện. |
| **Luồng API Thụ động (Passive)** | Bên ngoài, API Gateway | Hệ thống tiếp nhận yêu cầu từ các hệ thống bên ngoài (Cổng DVC, các Bộ/Ngành). Gateway thực hiện xác thực, kiểm soát lưu lượng (Rate Limit) trước khi trả dữ liệu. |
| **Luồng Giám sát (Monitoring)** | API Gateway, Log Collector, UI | Mọi giao dịch qua API đều được ghi vết (IP, User, Thời gian, Trạng thái). Dữ liệu log này được tổng hợp lên Dashboard để theo dõi hiệu năng và phát hiện lỗi. |

