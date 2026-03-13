# 4.8. PM08.QLCC_Quản lý cung cấp dữ liệu

## 4.8.1. PM08.QLCC.CC – Cung cấp dữ liệu dùng chung (Shared Data Provision)

### *4.8.1.1. Mục đích*
Quản lý việc cấp quyền truy cập các gói dữ liệu dùng chung cho các tổ chức, đơn vị trong và ngoài ngành, đảm bảo dữ liệu được chia sẻ đúng mục đích, có kiểm soát và an toàn.

### 4.8.1.2. PM08.QLCC.CC.MH01 – Cung cấp dữ liệu dùng chung

#### 4.8.1.2.1. MH01 Màn hình cung cấp dữ liệu dùng chung
##### Màn hình
- Màn hình:

![Cung cấp dữ liệu dùng chung](./images/provision_shared.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Màn hình cung cấp dữ liệu dùng chung</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Danh sách cung cấp | CLOB | - | - | Danh sách các cấu hình cấp quyền truy cập dữ liệu đã được thiết lập. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup thêm mới quyền truy cập cho một đơn vị (MH01.P01). |
| 2 | CN02 | Button icon | Mở popup xem chi tiết cấu hình quyền đã cấp (MH01.P02). |
| 3 | CN03 | Button icon | Mở popup phê duyệt yêu cầu (MH01.P03). |
| 4 | CN04 | Button icon | Mở popup xác nhận hủy bỏ quyền truy cập (MH01.P04). |

#### 4.8.1.2.2. MH01.P01 – Thêm cấu hình quyền truy cập
##### Màn hình
- Màn hình:

![Thêm cấu hình quyền truy cập](./images/themcauhinhtruycap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Màn hình thêm cấu hình quyền truy cập</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tổ chức | VARCHAR2(255) | Có | - | Tên đơn vị yêu cầu truy cập. |
| Loại tổ chức | VARCHAR2(50) | Có | - | Phân loại: Bộ/Ngành, Địa phương, Bên ngoài. |
| Gói dữ liệu | VARCHAR2(255) | Có | - | Chọn gói dữ liệu từ danh sách các gói đã được định nghĩa. |
| Mức độ truy cập | VARCHAR2(50) | Có | - | Các mức độ: Đọc, Ghi, Toàn quyền. |
| Giới hạn bản ghi | NUMBER | Không | - | Số lượng bản ghi tối đa được phép truy cập trong một khoảng thời gian. |
| Mục đích | VARCHAR2(1000) | Không | - | Ghi rõ lý do hoặc văn bản căn cứ để cấp quyền. |
| Ngày hết hạn | DATE | Không | - | Thời điểm quyền truy cập tự động hết hiệu lực. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu thông tin cấu hình quyền truy cập mới, chuyển trạng thái thành "Chờ duyệt". |
| 2 | CN02 | Button text | Hủy thao tác và đóng popup. |

#### 4.8.1.2.3. MH01.P02 – Chi tiết cấu hình quyền truy cập
##### Màn hình
- Màn hình:

![Chi tiết cấu hình quyền truy cập](./images/chitietcauhinhtruycap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình chi tiết cấu hình quyền truy cập</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã quyền | VARCHAR2(50) | - | - | Mã định danh duy nhất của quyền truy cập (VD: PERM_2024_001). |
| Tổ chức | VARCHAR2(255) | - | - | Hiển thị tên và phân loại tổ chức. |
| Gói dữ liệu | VARCHAR2(255) | - | - | Tên gói dữ liệu đã được cấp. |
| Trạng thái | VARCHAR2(50) | - | - | Các trạng thái: Hoạt động, Chờ duyệt, Hết hạn, Thu hồi. |
| Lượt sử dụng | NUMBER | - | - | Số lượng bản ghi đã được truy cập thực tế. |
| Tiến độ | NUMBER(3,2) | - | - | Tỷ lệ phần trăm lượt sử dụng so với giới hạn bản ghi đã cấp. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup chi tiết. |

#### 4.8.1.2.4. MH01.P03 – Phê duyệt yêu cầu
##### Màn hình
- Màn hình:

![Phê duyệt yêu cầu](./images/pheduyetrequre.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 7 - Màn hình phê duyệt yêu cầu cung cấp dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thông tin yêu cầu | CLOB | - | - | Hiển thị chi tiết đơn vị, gói dữ liệu và mục đích yêu cầu. |
| Ý kiến phê duyệt | CLOB | Không | - | Nhập ghi chú hoặc ý kiến của người duyệt. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Phê duyệt yêu cầu, cấp quyền truy cập chính thức. |
| 2 | CN02 | Button text | Từ chối yêu cầu và yêu cầu bổ sung thông tin nếu cần. |
| 3 | CN03 | Button text | Đóng popup. |

#### 4.8.1.2.5. MH01.P04 – Xác nhận hủy quyền truy cập
##### Màn hình
- Màn hình:

![Xác nhận hủy quyền](./images/confirm_cancel_permission.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 8 - Popup xác nhận hủy bỏ quyền truy cập dữ liệu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn hủy quyền truy cập này không? Hành động này không thể hoàn tác." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận thực hiện hủy quyền. |
| 2 | CN02 | Button text | Hủy thao tác và quay lại màn hình chính. |


## 4.8.2. PM08.QLCC.DC – Cung cấp danh mục (Catalog Provision)

### *4.8.2.1. Mục đích*
Thiết lập và quản lý các cấu trúc gói tin danh mục (catalog) để cung cấp cho các hệ thống nội ngành, đảm bảo tính nhất quán và tái sử dụng thông tin.

### 4.8.2.2. PM08.QLCC.DC.MH04 – Danh sách gói tin danh mục

#### 4.8.2.2.1. MH04 Màn hình danh sách gói tin danh mục
##### Màn hình
- Màn hình:

![Danh sách gói tin danh mục](./images/danhsachgoitindanhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Màn hình danh sách gói tin danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Danh sách gói tin | CLOB | - | - | Hiển thị danh sách các cấu trúc gói tin danh mục đã được tạo. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup để tạo/cập nhật một cấu trúc gói tin mới (MH04.P01). |
| 2 | CN02 | Button icon | Xem danh sách các trường dữ liệu (metadata) trong gói tin (MH04.P02). |
| 3 | CN03 | Button icon | Mở popup xác nhận loại bỏ gói tin khỏi hệ thống (MH04.P03). |

#### 4.8.2.2.2. MH04.P01 – Tạo/Cập nhật cấu trúc gói tin
##### Màn hình
- Màn hình:

![Tạo cấu trúc gói tin](./images/taocautrucgoitin.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 8 - Màn hình tạo mới hoặc cập nhật thông tin cấu trúc gói tin danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên gói tin | VARCHAR2(255) | Có | - | Tên gợi nhớ cho cấu trúc gói tin. |
| Mã gói tin | VARCHAR2(50) | Có | - | Mã kỹ thuật định danh gói tin. |
| Mô tả | VARCHAR2(1000) | Không | - | Ghi chú thêm về nội dung dữ liệu trong gói tin. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu thông tin cấu trúc gói tin. |
| 2 | CN02 | Button text | Hủy thao tác và đóng popup. |

#### 4.8.2.2.3. MH04.P02 – Cấu trúc gói tin (Metadata)
##### Màn hình
- Màn hình:

![Cấu trúc gói tin](./images/cautrucgoitin.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Màn hình cấu trúc gói tin</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên trường | VARCHAR2(255) | - | - | Tên hiển thị của trường dữ liệu (metadata). |
| Mã trường | VARCHAR2(100) | - | - | Mã kỹ thuật được sử dụng trong XML/JSON khi trao đổi. |
| Kiểu dữ liệu | VARCHAR2(50) | - | - | Các loại: String, Number, Date, Boolean... |
| Độ dài | NUMBER | - | - | Giới hạn số lượng ký tự (nếu áp dụng). |
| Bắt buộc | NUMBER(1) | - | - | Quy định trường này có bắt buộc phải có dữ liệu hay không (1: Có / 0: Không). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup. |

#### 4.8.2.2.4. MH04.P03 – Xác nhận loại bỏ gói tin
##### Màn hình
- Màn hình:

![Xác nhận loại bỏ](./images/confirm_remove_package.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 9 - Popup xác nhận loại bỏ gói tin danh mục khỏi hệ thống</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn loại bỏ gói tin này không? Dữ liệu liên quan sẽ bị xóa khỏi hệ thống." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận loại bỏ gói tin. |
| 2 | CN02 | Button text | Hủy thao tác. |

## 4.8.3. PM08.QLCC.DL – Cung cấp CSDL DLDC (DLDC Data Provision)

### *4.8.3.1. Mục đích*
Tra cứu và quản lý lịch sử cung cấp dữ liệu định danh công dân cho các hệ thống khác, đảm bảo khả năng giám sát và theo dõi dòng chảy dữ liệu.

### 4.8.3.2. PM08.QLCC.DL.MH06 – Chi tiết bản ghi và lịch sử cung cấp

#### 4.8.3.2.1. MH06 Màn hình chi tiết bản ghi và lịch sử cung cấp
##### Màn hình
- Màn hình:

![Chi tiết bản ghi và lịch sử cung cấp](./images/chitietbanghivalichsucungcap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Màn hình chi tiết bản ghi và lịch sử cung cấp</p>

##### Mô tả thông tin trên màn hình

**A. Thông tin chung bản ghi**
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã bản ghi | VARCHAR2(50) | - | - | Mã định danh của bản ghi trong hệ thống Kho DLDC. |
| Họ và tên | VARCHAR2(255) | - | - | Tên của chủ thể dữ liệu. |
| Số CCCD | VARCHAR2(20) | - | - | Số Căn cước công dân hoặc số định danh cá nhân. |
| Tình trạng | VARCHAR2(50) | - | - | Trạng thái của bản ghi (ví dụ: Đã xác minh, Đang xử lý...). |

**B. Bảng lịch sử cung cấp cho hệ thống**
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên hệ thống | VARCHAR2(255) | - | - | Tên hệ thống đã tiếp nhận dữ liệu này. |
| Thời gian | DATE | - | - | Thời điểm thực hiện cung cấp dữ liệu. |
| Trạng thái | VARCHAR2(50) | - | - | Kết quả cung cấp: Thành công, Thất bại, Đang xử lý. |
| Ghi chú | VARCHAR2(1000) | - | - | Thông tin phản hồi hoặc ghi chú từ hệ thống đích. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup. |
